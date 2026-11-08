import { afterEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, DEFAULT_COLLECTION_ID, loadCollections } from './useCollections'

afterEach(() => {
  localStorage.clear()
})

describe('loadCollections non-string fields', () => {
  it('normalizes a default collection with a non-string name and agent list', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        {
          id: DEFAULT_COLLECTION_ID,
          name: 42,
          agentIds: 'not-an-array',
          createdAt: 123,
          updatedAt: 456,
        },
      ])
    )

    const [defaultCollection] = loadCollections()

    expect(defaultCollection).toMatchObject({
      id: DEFAULT_COLLECTION_ID,
      name: 'All Agents',
      agentIds: [],
      isDefault: true,
    })
    expect(typeof defaultCollection.createdAt).toBe('string')
    expect(typeof defaultCollection.updatedAt).toBe('string')
  })

  it('drops a custom collection without a string name and rebuilds invalid ids', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        { id: 'numeric-name', name: 42, agentIds: ['a1'] },
        { id: 77, name: 'Valid name', agentIds: 'not-an-array' },
      ])
    )

    const collections = loadCollections()

    expect(collections).toHaveLength(2)
    expect(collections.some((collection) => collection.name === '42')).toBe(false)
    expect(collections[1].name).toBe('Valid name')
    expect(collections[1].agentIds).toEqual([])
    expect(typeof collections[1].id).toBe('string')
    expect(collections[1].id).not.toBe('77')
  })
})
