import { afterEach, describe, expect, it } from 'vitest'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  MAX_COLLECTIONS,
  loadCollections,
} from './useCollections'

afterEach(() => localStorage.clear())

describe('useCollections id fallback', () => {
  it('assigns fresh ids and timestamps to stored collections that lack them', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        { name: 'No Id', agentIds: [' a1 '] },
        { id: '   ', name: 'Blank Id', agentIds: [] },
      ])
    )

    const custom = loadCollections().filter((collection) => collection.id !== DEFAULT_COLLECTION_ID)

    expect(custom).toHaveLength(2)
    expect(custom[0].id).toBeTruthy()
    expect(custom[1].id).toBeTruthy()
    expect(custom[0].id).not.toBe(custom[1].id)
    expect(custom[0]).toMatchObject({ name: 'No Id', agentIds: ['a1'], isDefault: false })
    expect(Number.isNaN(Date.parse(custom[0].createdAt))).toBe(false)
    expect(Number.isNaN(Date.parse(custom[0].updatedAt))).toBe(false)
  })

  it('drops duplicate collection ids and caps the number of custom collections', () => {
    const stored = Array.from({ length: MAX_COLLECTIONS + 4 }, (_, index) => ({
      id: `c${index}`,
      name: `Collection ${index}`,
      agentIds: [],
    }))
    stored.push({ id: 'c0', name: 'Duplicate', agentIds: [] })
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(stored))

    const collections = loadCollections()

    expect(collections).toHaveLength(MAX_COLLECTIONS + 1)
    expect(collections[0].id).toBe(DEFAULT_COLLECTION_ID)
    expect(new Set(collections.map((collection) => collection.id)).size).toBe(collections.length)
  })
})
