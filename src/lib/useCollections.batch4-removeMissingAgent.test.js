import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { COLLECTIONS_STORAGE_KEY, useCollections } from './useCollections'

describe('removing an agent that is not in the collection', () => {
  beforeEach(() => localStorage.clear())

  it('reports success without changing the stored collection', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([
        { id: 'c1', name: 'Reads', agentIds: ['a1'], createdAt: 'x', updatedAt: 'x' },
      ])
    )
    const { result } = renderHook(() => useCollections())
    const collection = result.current.collections.find((item) => item.id === 'c1')
    const before = JSON.stringify(collection.agentIds)

    let response
    act(() => {
      response = result.current.removeAgentFromCollection('c1', 'missing-agent')
    })

    expect(response.ok).toBe(true)
    expect(result.current.collections.find((item) => item.id === 'c1').agentIds).toEqual(
      JSON.parse(before)
    )
  })
})
