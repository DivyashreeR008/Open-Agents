import { describe, expect, it } from 'vitest'
import { evaluateConditionalStep, selectBranch } from './pipelineBranching'

describe('pipeline branching malformed branch payloads', () => {
  it('returns no agents when the selected branch is not an array', () => {
    const result = evaluateConditionalStep(
      {
        condition: '{{ steps.route.output }}',
        branches: { billing: 'refund-writer', default: [] },
      },
      { steps: { route: { output: 'billing' } } }
    )

    expect(result).toEqual({
      conditionValue: 'billing',
      branchLabel: 'billing',
      branchAgents: [],
    })
  })

  it('returns no branch for a non-object branch map', () => {
    expect(selectBranch('billing', null)).toBeNull()
    expect(selectBranch('billing', 'billing')).toBeNull()
  })
})
