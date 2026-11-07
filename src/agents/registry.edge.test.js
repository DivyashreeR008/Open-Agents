import { describe, expect, it } from 'vitest'
import { AGENT_COUNT, assertUniqueAgentIds } from './registry'

describe('assertUniqueAgentIds edge inputs', () => {
  it('ignores null and id-less entries and returns the original array', () => {
    const agents = [null, { id: '' }, { name: 'No id' }, { id: 'writer' }]
    expect(assertUniqueAgentIds(agents)).toBe(agents)
    expect(AGENT_COUNT).toBeGreaterThan(0)
  })

  it('names a duplicate id once even when it appears more than twice', () => {
    expect(() =>
      assertUniqueAgentIds([{ id: 'writer' }, { id: 'writer' }, { id: 'writer' }])
    ).toThrow('Duplicate agent id: writer')
  })
})
