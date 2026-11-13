import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  loadCollections,
  useCollections,
} from './useCollections'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(
    COLLECTIONS_STORAGE_KEY,
    JSON.stringify([
      { id: DEFAULT_COLLECTION_ID, name: 'All Agents', agentIds: [], isDefault: true },
      { id: 'c1', name: 'Reads', agentIds: ['a1'] },
    ])
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('collection mutation integrity', () => {
  it('rejects unknown collections and the built-in collection when removing', () => {
    const { result } = renderHook(() => useCollections())

    expect(result.current.removeAgentFromCollection('missing', 'a1')).toMatchObject({
      ok: false,
      error: 'Collection not found.',
    })
    expect(result.current.removeAgentFromCollection(DEFAULT_COLLECTION_ID, 'a1')).toMatchObject({
      ok: false,
    })
    expect(loadCollections().find((item) => item.id === 'c1').agentIds).toEqual(['a1'])
  })

  it('does not let a custom collection reuse the built-in name', () => {
    const { result } = renderHook(() => useCollections())

    expect(result.current.createCollection('all agents')).toMatchObject({
      ok: false,
      error: 'A collection with that name already exists.',
    })
    expect(result.current.renameCollection('c1', 'ALL AGENTS')).toMatchObject({
      ok: false,
      error: 'A collection with that name already exists.',
    })
    expect(loadCollections()).toHaveLength(2)
  })

  it('surfaces a storage write failure without throwing or reporting success', () => {
    const { result } = renderHook(() => useCollections())
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    let response
    act(() => {
      response = result.current.renameCollection('c1', 'Reading')
    })

    expect(response.ok).toBe(false)
    expect(response.saved).toBe(false)
    expect(response.error).toContain('Could not save')
    expect(result.current.collections.find((item) => item.id === 'c1').name).toBe('Reads')
  })
})
