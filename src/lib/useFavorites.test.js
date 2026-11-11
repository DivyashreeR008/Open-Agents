import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('should save a favorite successfully', () => {
    const { result } = renderHook(() => useFavorites())
    let toggleResult

    act(() => {
      toggleResult = result.current.toggleFavorite('agent-1')
    })

    expect(toggleResult).toEqual({ ok: true })
    expect(result.current.favorites).toEqual(['agent-1'])
    expect(localStorage.getItem('oa_favorites')).toBe(JSON.stringify(['agent-1']))
  })

  it('should not throw when localStorage write fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage write failed')
    })

    const { result } = renderHook(() => useFavorites())
    let toggleResult

    expect(() => {
      act(() => {
        toggleResult = result.current.toggleFavorite('agent-1')
      })
    }).not.toThrow()

    expect(toggleResult.ok).toBe(false)
    expect(toggleResult.error).toMatch(/could not be saved/i)
    expect(toggleResult.error).toMatch(/allow site data/i)
  })

  it('should not update favorites when localStorage write fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage write failed')
    })

    const { result } = renderHook(() => useFavorites())
    let toggleResult

    act(() => {
      toggleResult = result.current.toggleFavorite('agent-1')
    })

    expect(toggleResult.ok).toBe(false)
    expect(result.current.favorites).toEqual([])
    expect(localStorage.getItem('oa_favorites')).toBeNull()
  })
})
