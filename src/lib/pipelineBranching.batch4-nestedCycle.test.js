import { describe, expect, it } from 'vitest'
import { detectCircularBranches } from './pipelineBranching'

describe('conditional branch nested cycle detection', () => {
  it('finds a cycle that passes through another conditional step', () => {
    const root = {
      type: 'conditional_branch',
      id: 'root',
      condition: 'x',
      branches: { default: ['middle'] },
    }
    const middle = {
      type: 'conditional_branch',
      id: 'middle',
      condition: 'y',
      branches: { default: ['root'] },
    }

    const problems = detectCircularBranches(root, [root, middle])

    expect(problems).toHaveLength(1)
    expect(problems[0]).toContain('eventually loops back')
  })
})
