import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { DEFAULT_COLLECTION_ID, useCollections } from './useCollections'

beforeEach(() => {
  localStorage.clear()
})

describe('collection deletion with another custom collection', () => {
  it('merges the deleted agents into the default and keeps the other custom collection', () => {
    const { result } = renderHook(() => useCollections())
    let first
    let second

    act(() => {
      first = result.current.createCollection('First').collection.id
      second = result.current.createCollection('Second').collection.id
      result.current.addAgentToCollection(first, 'a1')
      result.current.addAgentToCollection(second, 'a2')
    })

    act(() => {
      expect(result.current.deleteCollection(first)).toMatchObject({ ok: true })
    })

    const byId = new Map(
      result.current.collections.map((collection) => [collection.id, collection])
    )
    expect(byId.get(DEFAULT_COLLECTION_ID).agentIds).toContain('a1')
    expect(byId.get(second)).toMatchObject({ name: 'Second', agentIds: ['a2'] })
    expect(byId.has(first)).toBe(false)
  })
})
