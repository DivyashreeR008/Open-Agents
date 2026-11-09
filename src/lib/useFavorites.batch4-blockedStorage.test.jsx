import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavorites } from './useFavorites'

describe('favorites blocked storage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('does not toggle in memory when the favorite cannot be saved', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('agent-1'))

    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite('agent-1')).toBe(false)
  })
})
