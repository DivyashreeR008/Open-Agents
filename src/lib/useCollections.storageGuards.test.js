import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  loadCollections,
  saveCollections,
} from './useCollections'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  localStorage?.clear?.()
})

describe('useCollections storage guards', () => {
  it('returns the default collection when storage cannot be read', () => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify([{ id: 'c1', name: 'Reads' }]))
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    const collections = loadCollections()

    expect(collections).toHaveLength(1)
    expect(collections[0]).toMatchObject({ id: DEFAULT_COLLECTION_ID, name: 'All Agents' })
  })

  it('works without a localStorage global at all', () => {
    vi.stubGlobal('localStorage', undefined)

    expect(loadCollections().map((collection) => collection.id)).toEqual([DEFAULT_COLLECTION_ID])
    expect(() => saveCollections([{ id: 'c1', name: 'Reads', agentIds: [] }])).not.toThrow()
  })

  it('continues to save a normalized copy when storage is available', () => {
    saveCollections([
      { id: 'c1', name: ' Reads ', agentIds: ['a1', 'a1', ''] },
      { id: 'c1', name: 'Duplicate id', agentIds: ['a2'] },
    ])

    const stored = JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY))
    expect(stored.map((collection) => collection.id)).toEqual([DEFAULT_COLLECTION_ID, 'c1'])
    expect(stored[1]).toMatchObject({ name: 'Reads', agentIds: ['a1'] })
  })
})
