import { describe, expect, it } from 'vitest'
import { buildDraftAgent } from './marketplace'

describe('marketplace draft agent without a catalogue', () => {
  it('returns null when the agents collection is not an array', () => {
    expect(buildDraftAgent({ config: { baseAgentId: 'base' } }, null)).toBeNull()
    expect(buildDraftAgent({ config: { baseAgentId: 'base' } }, 'not-an-array')).toBeNull()
  })
})
