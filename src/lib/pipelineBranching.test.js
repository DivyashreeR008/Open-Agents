import { describe, expect, it } from 'vitest'
import {
  CONDITIONAL_STEP_TYPE,
  DEFAULT_BRANCH,
  detectCircularBranches,
  evaluateConditionalStep,
  isConditionalStep,
  resolveTemplate,
  selectBranch,
  validateConditionalStep,
} from './pipelineBranching'

describe('isConditionalStep', () => {
  it('recognises conditional entries only', () => {
    expect(isConditionalStep({ type: CONDITIONAL_STEP_TYPE })).toBe(true)
    expect(isConditionalStep('bug-report-generator')).toBe(false)
    expect(isConditionalStep(null)).toBe(false)
    expect(isConditionalStep({ type: 'agent' })).toBe(false)
  })
})

describe('resolveTemplate', () => {
  const context = {
    input: 'refund please',
    steps: { classify: { output: 'Billing' }, scores: [4, 8] },
  }

  it('resolves dotted paths and array indexes', () => {
    expect(resolveTemplate('{{ steps.classify.output }}', context)).toBe('Billing')
    expect(resolveTemplate('Score {{ steps.scores[1] }}', context)).toBe('Score 8')
  })

  it('renders missing values as an empty string', () => {
    expect(resolveTemplate('{{ steps.missing.output }}', context)).toBe('')
    expect(resolveTemplate('{{ input.unknown.deep }}', context)).toBe('')
    expect(resolveTemplate('{{ steps.classify.output }}', null)).toBe('')
  })

  it('leaves non-templates untouched and rejects non-string templates', () => {
    expect(resolveTemplate('plain text', context)).toBe('plain text')
    expect(resolveTemplate(null, context)).toBe('')
    expect(resolveTemplate(42, context)).toBe('')
  })
})

describe('selectBranch', () => {
  const branches = {
    billing: ['refund-policy-writer'],
    technical: ['bug-report-generator'],
    [DEFAULT_BRANCH]: ['eli5-explainer'],
  }

  it('matches labels without case or surrounding whitespace', () => {
    expect(selectBranch('  BILLING ', branches)).toBe('billing')
    expect(selectBranch('Technical', branches)).toBe('technical')
  })

  it('falls back to the default branch', () => {
    expect(selectBranch('unmatched', branches)).toBe(DEFAULT_BRANCH)
    expect(selectBranch('', branches)).toBe(DEFAULT_BRANCH)
  })

  it('returns null when there is no branch map or no default', () => {
    expect(selectBranch('billing', null)).toBeNull()
    expect(selectBranch('billing', ['billing'])).toBeNull()
    expect(selectBranch('other', { billing: [] })).toBeNull()
  })
})

describe('evaluateConditionalStep', () => {
  const step = {
    type: CONDITIONAL_STEP_TYPE,
    id: 'route',
    condition: '{{ steps.classify.output }}',
    branches: {
      billing: ['refund-policy-writer'],
      default: ['eli5-explainer'],
    },
  }

  it('returns the matching label and agents', () => {
    expect(
      evaluateConditionalStep(step, { steps: { classify: { output: 'billing' } } })
    ).toEqual({
      conditionValue: 'billing',
      branchLabel: 'billing',
      branchAgents: ['refund-policy-writer'],
    })
  })

  it('returns the default branch for an unmatched value', () => {
    expect(
      evaluateConditionalStep(step, { steps: { classify: { output: 'other' } } })
    ).toEqual({
      conditionValue: 'other',
      branchLabel: 'default',
      branchAgents: ['eli5-explainer'],
    })
  })

  it('returns no agents when no branch can be chosen', () => {
    expect(
      evaluateConditionalStep(
        { condition: '{{ input }}', branches: { billing: ['refund-policy-writer'] } },
        { input: 'other' }
      ).branchAgents
    ).toEqual([])
    expect(
      evaluateConditionalStep(
        { condition: '{{ input }}', branches: { billing: 'not-an-array' } },
        { input: 'billing' }
      ).branchAgents
    ).toEqual([])
  })
})

describe('validateConditionalStep', () => {
  const valid = {
    id: 'route',
    condition: '{{ steps.classify.output }}',
    branches: {
      billing: ['refund-policy-writer'],
      default: ['eli5-explainer'],
    },
  }

  it('accepts a complete conditional step', () => {
    expect(validateConditionalStep(valid)).toEqual([])
  })

  it('reports missing identity, condition, branches, and default', () => {
    expect(validateConditionalStep({})).toEqual([
      'Conditional step is missing an "id".',
      'Conditional step is missing a "condition" template.',
      'Conditional step defines no branches.',
      'Conditional step has no "default" branch; runs with an unmatched condition will fail.',
    ])

    expect(
      validateConditionalStep({
        id: 'route',
        condition: '{{ input }}',
        branches: { billing: [], technical: 'agent' },
      })
    ).toEqual([
      'Conditional step has no "default" branch; runs with an unmatched condition will fail.',
      'Branch "billing" has no agent steps.',
      'Branch "technical" has no agent steps.',
    ])
  })

  it('surfaces cycles found by the branch walker', () => {
    const looped = {
      ...valid,
      branches: { default: ['route'] },
    }
    expect(validateConditionalStep(looped, [looped])).toContain(
      'Branch "default" directly references the conditional step itself, creating a cycle.'
    )
  })
})

describe('detectCircularBranches', () => {
  it('ignores steps without a usable branch map', () => {
    expect(detectCircularBranches({})).toEqual([])
    expect(detectCircularBranches({ branches: null })).toEqual([])
  })

  it('detects a direct self-reference', () => {
    const step = { id: 'route', branches: { default: ['route'] } }
    expect(detectCircularBranches(step, [step])).toEqual([
      'Branch "default" directly references the conditional step itself, creating a cycle.',
    ])
  })

  it('detects an indirect loop through another conditional step', () => {
    const first = {
      type: CONDITIONAL_STEP_TYPE,
      id: 'first',
      branches: { default: ['second'] },
    }
    const second = {
      type: CONDITIONAL_STEP_TYPE,
      id: 'second',
      branches: { default: ['first'] },
    }

    expect(detectCircularBranches(first, [first, second])).toEqual([
      'Branch "default" references a step that eventually loops back to this conditional step.',
    ])
  })

  it('allows a linear chain that does not return to the source', () => {
    const first = { id: 'first', branches: { default: ['second'] } }
    const second = { id: 'second', branches: { default: ['agent-c'] } }

    expect(detectCircularBranches(first, [first, second])).toEqual([])
  })
})
