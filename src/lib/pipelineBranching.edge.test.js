import { describe, expect, it } from 'vitest'
import {
  CONDITIONAL_STEP_TYPE,
  DEFAULT_BRANCH,
  detectCircularBranches,
  evaluateConditionalStep,
  selectBranch,
} from './pipelineBranching'

describe('pipeline branching empty condition values', () => {
  it('selects the default branch for null and undefined values', () => {
    const branches = {
      billing: ['refund-policy-writer'],
      [DEFAULT_BRANCH]: ['eli5-explainer'],
    }

    expect(selectBranch(null, branches)).toBe(DEFAULT_BRANCH)
    expect(selectBranch(undefined, branches)).toBe(DEFAULT_BRANCH)
    expect(selectBranch('   ', branches)).toBe(DEFAULT_BRANCH)
  })

  it('evaluates a whitespace-only condition as an empty default match', () => {
    const step = {
      type: CONDITIONAL_STEP_TYPE,
      id: 'route',
      condition: '{{ steps.classify.output }}',
      branches: {
        billing: ['refund-policy-writer'],
        default: ['eli5-explainer'],
      },
    }

    expect(evaluateConditionalStep(step, { steps: { classify: { output: ' \n ' } } })).toEqual({
      conditionValue: '',
      branchLabel: DEFAULT_BRANCH,
      branchAgents: ['eli5-explainer'],
    })
  })
})

describe('circular branch walks with sparse and shared steps', () => {
  it('ignores plain string steps and conditionals with no branch map', () => {
    const plain = {
      id: 'route',
      branches: { default: ['plain-agent'] },
    }
    expect(detectCircularBranches(plain, ['plain-agent'])).toEqual([])

    const bareConditional = {
      type: CONDITIONAL_STEP_TYPE,
      id: 'second',
    }
    const pointingAtBare = {
      id: 'route',
      branches: { default: ['second'] },
    }
    expect(detectCircularBranches(pointingAtBare, [pointingAtBare, bareConditional])).toEqual([])
  })

  it('visits a shared descendant once without reporting a cycle', () => {
    const route = {
      id: 'route',
      branches: { default: ['branch-a'] },
    }
    const branchA = {
      type: CONDITIONAL_STEP_TYPE,
      id: 'branch-a',
      branches: { default: ['shared-one', 'shared-two'] },
    }
    const sharedOne = {
      type: CONDITIONAL_STEP_TYPE,
      id: 'shared-one',
      branches: { default: ['leaf-agent'] },
    }
    const sharedTwo = {
      type: CONDITIONAL_STEP_TYPE,
      id: 'shared-two',
      branches: { default: ['leaf-agent'] },
    }

    expect(detectCircularBranches(route, [route, branchA, sharedOne, sharedTwo])).toEqual([])
  })
})
