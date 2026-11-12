import { beforeEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, loadCollections } from './useCollections'

beforeEach(() => localStorage.clear())

describe('loadCollections agent id normalization', () => {
  it('trims, drops non-strings, and removes duplicates', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'research',
          name: '  Research  ',
          agentIds: [' a1 ', 'a1', '', 5, 'a2', 'a2'],
        },
      ])
    )

    const collection = loadCollections().find((item) => item.id === 'research')

    expect(collection.name).toBe('Research')
    expect(collection.agentIds).toEqual(['a1', 'a2'])
  })
})
