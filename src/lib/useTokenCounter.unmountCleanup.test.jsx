import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tokenEstimate, useTokenCounter } from './useTokenCounter'

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useTokenCounter timer ownership', () => {
  it('clears the pending estimate when the hook unmounts before the debounce expires', () => {
    vi.useFakeTimers()
    const { unmount } = renderHook(() => useTokenCounter('pending text', 250))

    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not leak a stale estimate when text changes twice inside the debounce window', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ text }) => useTokenCounter(text, 100), {
      initialProps: { text: 'first draft' },
    })

    act(() => vi.advanceTimersByTime(40))
    rerender({ text: 'second draft' })
    act(() => vi.advanceTimersByTime(40))
    rerender({ text: 'final draft' })

    act(() => vi.advanceTimersByTime(100))

    expect(result.current).toEqual({
      tokens: tokenEstimate('final draft'),
      isEstimating: false,
    })
  })
})
