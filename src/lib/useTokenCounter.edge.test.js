import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tokenEstimate, useTokenCounter } from './useTokenCounter'

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('token estimation at mixed code point boundaries', () => {
  it('advances by two code units after a surrogate pair', () => {
    expect(tokenEstimate('\u{1F600}a')).toBe(6)
    expect(tokenEstimate('\u{1F600}a12345')).toBe(7)
  })

  it('keeps control characters and punctuation at the minimum one token', () => {
    expect(tokenEstimate('\u0000')).toBe(1)
    expect(tokenEstimate('.')).toBe(1)
  })
})

describe('useTokenCounter debounce boundaries and cleanup', () => {
  it('estimates immediately with a zero delay for undefined text', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTokenCounter(undefined, 0))

    expect(result.current).toEqual({ tokens: 0, isEstimating: true })

    act(() => vi.advanceTimersByTime(0))

    expect(result.current).toEqual({ tokens: 0, isEstimating: false })
  })

  it('returns to zero after the text becomes blank', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ text }) => useTokenCounter(text, 100), {
      initialProps: { text: 'hello world' },
    })

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toEqual({ tokens: 6, isEstimating: false })

    rerender({ text: '   ' })
    expect(result.current).toEqual({ tokens: 6, isEstimating: true })

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toEqual({ tokens: 0, isEstimating: false })
  })

  it('restarts the pending timer when the delay changes', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ delay }) => useTokenCounter('hello', delay), {
      initialProps: { delay: 300 },
    })

    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toEqual({ tokens: 0, isEstimating: true })

    rerender({ delay: 50 })
    act(() => vi.advanceTimersByTime(49))
    expect(result.current).toEqual({ tokens: 0, isEstimating: true })

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toEqual({ tokens: 2, isEstimating: false })
  })
})
