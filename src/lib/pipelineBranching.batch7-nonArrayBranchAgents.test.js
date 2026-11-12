import { describe, expect, it } from 'vitest'
import { evaluateConditionalStep } from './pipelineBranching'

describe('evaluateConditionalStep non-array branch values', () => {
  it('returns an empty agent list when the selected branch is a string', () => {
    const result = evaluateConditionalStep(
      { condition: '{{ input }}', branches: { default: 'agent-one' } },
      { input: 'anything' }
    )

    expect(result).toEqual({
      conditionValue: 'anything',
      branchLabel: 'default',
      branchAgents: [],
    })
  })
})
