import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimedState } from './useTimedState'

afterEach(() => vi.useRealTimers())

describe('useTimedState', () => {
  it('keeps the latest copy confirmation visible for its full duration', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTimedState(null))

    act(() => result.current[1]('first', 2000))
    act(() => vi.advanceTimersByTime(1000))
    act(() => result.current[1]('second', 2000))
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current[0]).toBe('second')
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current[0]).toBe(null)
  })

  it('cancels pending resets when the surface closes or unmounts', () => {
    vi.useFakeTimers()
    const { result, rerender, unmount } = renderHook(({ open }) => useTimedState(false, open), {
      initialProps: { open: true },
    })

    act(() => result.current[1](true, 2000))
    rerender({ open: false })
    expect(result.current[0]).toBe(false)
    expect(vi.getTimerCount()).toBe(0)

    rerender({ open: true })
    act(() => result.current[1](true, 2000))
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
