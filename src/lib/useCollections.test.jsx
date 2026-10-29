import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  useCollections,
} from './useCollections'

const existingCollections = [
  {
    id: DEFAULT_COLLECTION_ID,
    name: 'All Agents',
    agentIds: [],
    isDefault: true,
  },
  { id: 'frontend', name: 'Frontend', agentIds: ['agent-1'] },
  { id: 'favorites', name: 'Favorites', agentIds: [] },
]

afterEach(() => {
  localStorage.clear()
})

describe('useCollections', () => {
  it('keeps an agent in its existing collections when added to another collection', () => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(existingCollections))
    const { result } = renderHook(() => useCollections())

    act(() => {
      expect(result.current.addAgentToCollection('favorites', 'agent-1')).toMatchObject({
        ok: true,
      })
    })

    expect(result.current.getCollectionById('frontend').agentIds).toContain('agent-1')
    expect(result.current.getCollectionById('favorites').agentIds).toContain('agent-1')
  })
})
