import { describe, expect, it } from 'vitest'
import { CONDITIONAL_STEP_TYPE, detectCircularBranches } from './pipelineBranching'

describe('detectCircularBranches descendant cycles', () => {
  it('detects a loop between descendant steps that never returns to the root', () => {
    const root = {
      id: 'root',
      type: CONDITIONAL_STEP_TYPE,
      branches: { yes: ['a'] },
    }
    const a = {
      id: 'a',
      type: CONDITIONAL_STEP_TYPE,
      branches: { yes: ['b'] },
    }
    const b = {
      id: 'b',
      type: CONDITIONAL_STEP_TYPE,
      branches: { yes: ['a'] },
    }

    expect(detectCircularBranches(root, [root, a, b])).toEqual([
      'Branch "yes" references a step that eventually loops back to this conditional step.',
    ])
  })

  it('ignores non-array branch values on descendant steps', () => {
    const root = {
      id: 'root',
      type: CONDITIONAL_STEP_TYPE,
      branches: { yes: ['a'] },
    }
    const a = {
      id: 'a',
      type: CONDITIONAL_STEP_TYPE,
      branches: { yes: 'b' },
    }

    expect(detectCircularBranches(root, [root, a])).toEqual([])
  })
})
