import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useCollections } from './useCollections'

describe('collection import name guard', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('rejects an import with a blank or non-string name', () => {
    const { result } = renderHook(() => useCollections())

    expect(result.current.importCollection({ name: '   ', agentIds: ['a'] })).toEqual({
      ok: false,
      error: 'Collection name is required.',
    })
    expect(result.current.importCollection({ name: null })).toEqual({
      ok: false,
      error: 'Collection name is required.',
    })
  })
})
