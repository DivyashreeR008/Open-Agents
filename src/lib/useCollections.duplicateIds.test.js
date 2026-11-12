import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, DEFAULT_COLLECTION_ID, useCollections } from './useCollections'

afterEach(() => {
  localStorage.clear()
})

describe('useCollections duplicate stored ids', () => {
  it('keeps the first collection when stored records share an id', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        { id: DEFAULT_COLLECTION_ID, name: 'All Agents', agentIds: [], isDefault: true },
        {
          id: 'shared',
          name: 'First',
          agentIds: ['agent-1'],
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'shared',
          name: 'Second',
          agentIds: ['agent-2'],
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
        },
      ])
    )

    const { result } = renderHook(() => useCollections())

    expect(result.current.collections.map((collection) => collection.id)).toEqual([
      DEFAULT_COLLECTION_ID,
      'shared',
    ])
    expect(result.current.getCollectionById('shared')).toMatchObject({
      name: 'First',
      agentIds: ['agent-1'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })
  })

  it('keeps distinct stored collections in their original order', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        { id: DEFAULT_COLLECTION_ID, name: 'All Agents', agentIds: [], isDefault: true },
        { id: 'alpha', name: 'Alpha', agentIds: ['agent-1'] },
        { id: 'beta', name: 'Beta', agentIds: ['agent-2'] },
      ])
    )

    const { result } = renderHook(() => useCollections())

    expect(result.current.collections.map((collection) => collection.id)).toEqual([
      DEFAULT_COLLECTION_ID,
      'alpha',
      'beta',
    ])
    expect(result.current.getCollectionById('alpha')).toMatchObject({
      name: 'Alpha',
      agentIds: ['agent-1'],
    })
    expect(result.current.getCollectionById('beta')).toMatchObject({
      name: 'Beta',
      agentIds: ['agent-2'],
    })
  })
})
