import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useCollections } from './useCollections'

describe('collection delete missing id', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('reports a missing collection without changing the list', () => {
    const { result } = renderHook(() => useCollections())
    const beforeIds = result.current.collections.map((collection) => collection.id)

    let outcome
    act(() => {
      outcome = result.current.deleteCollection('missing-id')
    })

    expect(outcome).toMatchObject({
      ok: false,
      error: 'Collection not found.',
    })
    expect(result.current.collections.map((collection) => collection.id)).toEqual(beforeIds)
  })
})
