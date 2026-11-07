import { afterEach, describe, expect, it } from 'vitest'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  MAX_AGENTS_PER_COLLECTION,
  loadCollections,
} from './useCollections'

afterEach(() => {
  localStorage.clear()
})

describe('loadCollections edge normalization', () => {
  it('keeps the default first, drops nameless customs, and cleans agent ids', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        { id: 'custom-1', name: 'Reader', agentIds: ['a', 'a', '', null, 'b'] },
        { id: DEFAULT_COLLECTION_ID, name: 'Wrong name', agentIds: ['x'] },
        { id: 'custom-2', name: '   ', agentIds: ['b'] },
      ])
    )

    const collections = loadCollections()

    expect(collections[0]).toMatchObject({
      id: DEFAULT_COLLECTION_ID,
      name: 'All Agents',
      agentIds: ['x'],
    })
    expect(collections).toHaveLength(2)
    expect(collections[1].name).toBe('Reader')
    expect(collections[1].agentIds).toEqual(['a', 'b'])
  })

  it('caps a stored collection at the per-collection agent limit', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'custom-1',
          name: 'Everything',
          agentIds: Array.from({ length: MAX_AGENTS_PER_COLLECTION + 5 }, (_, i) => `a${i}`),
        },
      ])
    )

    const [, custom] = loadCollections()
    expect(custom.agentIds).toHaveLength(MAX_AGENTS_PER_COLLECTION)
  })
})
