import { describe, expect, it } from 'vitest'
import { evaluateConditionalStep, selectBranch } from './pipelineBranching'

describe('conditional branch missing agents', () => {
  it('returns an empty agent list for a matched branch with no value', () => {
    const step = {
      id: 'route',
      condition: '{{ steps.classify.output }}',
      branches: { billing: undefined, default: ['fallback'] },
    }

    expect(evaluateConditionalStep(step, { steps: { classify: { output: 'billing' } } })).toEqual({
      conditionValue: 'billing',
      branchLabel: 'billing',
      branchAgents: [],
    })
  })

  it('returns null when there is no default branch and no match', () => {
    expect(selectBranch('technical', { billing: ['a'] })).toBeNull()
    expect(selectBranch('', null)).toBeNull()
  })
})
