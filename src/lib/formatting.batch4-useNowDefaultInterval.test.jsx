import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useNow } from './formatting'

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0)

describe('useNow default interval', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('refreshes every thirty seconds when no interval is supplied', () => {
    const { result, unmount } = renderHook(() => useNow())

    expect(result.current).toBe(NOW)
    act(() => vi.advanceTimersByTime(29_999))
    expect(result.current).toBe(NOW)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe(NOW + 30_000)

    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
