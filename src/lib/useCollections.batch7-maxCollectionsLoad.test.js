import { beforeEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, loadCollections } from './useCollections'

beforeEach(() => localStorage.clear())

describe('loadCollections collection cap', () => {
  it('keeps the default collection and ten custom collections', () => {
    const customs = Array.from({ length: 12 }, (_, index) => ({
      id: 'c' + index,
      name: 'Collection ' + index,
      agentIds: [],
    }))
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(customs))

    const collections = loadCollections()

    expect(collections).toHaveLength(11)
    expect(collections[0].id).toBe('all-agents')
    expect(collections.at(-1).id).toBe('c9')
  })
})
