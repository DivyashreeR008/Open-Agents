import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAnalytics } from './useAnalytics'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('useAnalytics seeding storage guards', () => {
  it('mounts without throwing when reading storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events).toEqual([])
    expect(result.current.stats.totalRuns).toBe(0)
  })

  it('mounts without throwing when the seed flag cannot be written', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events).toEqual([])
    expect(result.current.stats.totalRuns).toBe(0)
  })
})
