import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTokenCounter } from './useTokenCounter'

afterEach(() => {
  vi.useRealTimers()
})

describe('empty token estimates', () => {
  it('resolves an empty value without waiting for the debounce', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTokenCounter('', 300))

    expect(result.current).toEqual({ tokens: 0, isEstimating: false })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('clears a previous count and pending estimate as soon as the text is emptied', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ text }) => useTokenCounter(text, 300), {
      initialProps: { text: 'hello' },
    })

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toEqual({ tokens: 2, isEstimating: false })

    rerender({ text: '   ' })

    expect(result.current).toEqual({ tokens: 0, isEstimating: false })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('skips the delay for whitespace-only and non-string values', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ text }) => useTokenCounter(text, 300), {
      initialProps: { text: 'hello' },
    })

    rerender({ text: null })
    expect(result.current).toEqual({ tokens: 0, isEstimating: false })

    rerender({ text: 'hello' })
    rerender({ text: '   \n\t' })
    expect(result.current).toEqual({ tokens: 0, isEstimating: false })
    expect(vi.getTimerCount()).toBe(0)
  })
})
