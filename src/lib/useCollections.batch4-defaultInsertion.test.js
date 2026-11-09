import { afterEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, DEFAULT_COLLECTION_ID, loadCollections } from './useCollections'

describe('collection default insertion', () => {
  afterEach(() => localStorage.clear())

  it('adds the default collection ahead of stored custom collections', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([{ id: 'custom-1', name: 'Mine', agentIds: ['a'] }])
    )

    const collections = loadCollections()

    expect(collections.map((collection) => collection.id)).toEqual([
      DEFAULT_COLLECTION_ID,
      'custom-1',
    ])
    expect(collections[0].isDefault).toBe(true)
  })
})
