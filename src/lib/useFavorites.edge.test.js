import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFavorites } from './useFavorites'

const STORAGE_KEY = 'oa_favorites'

describe('useFavorites edge cases', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('recovers from malformed stored data and can favorite again', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json')

    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])

    act(() => {
      result.current.toggleFavorite('agent-1')
    })

    expect(result.current.favorites).toEqual(['agent-1'])
    expect(result.current.isFavorite('agent-1')).toBe(true)
    expect(result.current.isFavorite('agent-2')).toBe(false)
  })

  it('removes an existing favorite while keeping the remaining order', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('agent-1')
    })
    act(() => {
      result.current.toggleFavorite('agent-2')
    })
    expect(result.current.favorites).toEqual(['agent-2', 'agent-1'])

    act(() => {
      result.current.toggleFavorite('agent-2')
    })

    expect(result.current.favorites).toEqual(['agent-1'])
    expect(result.current.isFavorite('agent-2')).toBe(false)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(['agent-1']))
  })

  it('keeps separate hook consumers in sync and detaches an unmounted one', () => {
    const first = renderHook(() => useFavorites())
    const second = renderHook(() => useFavorites())

    act(() => {
      first.result.current.toggleFavorite('shared')
    })
    expect(second.result.current.favorites).toEqual(['shared'])

    first.unmount()

    act(() => {
      second.result.current.toggleFavorite('later')
    })

    expect(second.result.current.favorites).toEqual(['later', 'shared'])
  })

  it('returns an empty list when storage reads are blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage access denied')
    })

    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])

    act(() => {
      result.current.toggleFavorite('offline-agent')
    })

    expect(result.current.favorites).toEqual([])
  })
})
