import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useFavorites } from './useFavorites'

const STORAGE_KEY = 'oa_favorites'

describe('favorites valid JSON that is not a list', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('treats an object payload as empty and can add a favorite again', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'agent-1': true }))

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite('agent-1')).toBe(false)

    act(() => result.current.toggleFavorite('agent-2'))

    expect(result.current.favorites).toEqual(['agent-2'])
    expect(result.current.isFavorite('agent-2')).toBe(true)
  })
})
