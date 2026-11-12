import { describe, expect, it } from 'vitest'
import { createAgentSnapshot } from './marketplace'

describe('createAgentSnapshot unserializable values', () => {
  it('returns null instead of throwing for a BigInt field', () => {
    expect(createAgentSnapshot({ id: 'a1', count: 1n })).toBeNull()
  })
})
