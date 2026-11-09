import { beforeEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, DEFAULT_COLLECTION_ID, loadCollections } from './useCollections'

describe('collection storage with valid JSON that is not a list', () => {
  beforeEach(() => localStorage.clear())

  it('falls back to the default collection instead of treating the object as a list', () => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify({ custom: true }))

    const collections = loadCollections()

    expect(collections).toHaveLength(1)
    expect(collections[0]).toMatchObject({ id: DEFAULT_COLLECTION_ID, name: 'All Agents' })
  })
})
