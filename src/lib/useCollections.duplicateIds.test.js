import { afterEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, loadCollections } from './useCollections'

afterEach(() => localStorage.clear())

describe('collection storage duplicate ids', () => {
  it('keeps the first collection when stored records share an id', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        { id: 'same', name: 'First copy', agentIds: ['a1'] },
        { id: 'same', name: 'Second copy', agentIds: ['a2'] },
      ])
    )

    const customs = loadCollections().filter((collection) => collection.id === 'same')

    expect(customs).toHaveLength(1)
    expect(customs[0]).toMatchObject({ name: 'First copy', agentIds: ['a1'] })
  })
})
