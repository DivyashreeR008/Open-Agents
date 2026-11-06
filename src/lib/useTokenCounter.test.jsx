import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tokenEstimate, useTokenCounter } from './useTokenCounter'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('tokenEstimate', () => {
  it('returns zero for empty, blank, null, and undefined input', () => {
    expect(tokenEstimate('')).toBe(0)
    expect(tokenEstimate('   \n\t')).toBe(0)
    expect(tokenEstimate(null)).toBe(0)
    expect(tokenEstimate(undefined)).toBe(0)
  })

  it('counts ASCII words in four-character chunks and spaces individually', () => {
    expect(tokenEstimate('a')).toBe(1)
    expect(tokenEstimate('hello')).toBe(2)
    expect(tokenEstimate('hello world')).toBe(6)
    expect(tokenEstimate('1234')).toBe(1)
    expect(tokenEstimate('12345')).toBe(2)
    expect(tokenEstimate('a b c')).toBe(6)
  })

  it('counts punctuation one token at a time', () => {
    expect(tokenEstimate('!!!')).toBe(3)
    expect(tokenEstimate('a, b.')).toBe(6)
  })

  it('assigns more weight to multi-byte code points', () => {
    expect(tokenEstimate('é')).toBe(2)
    expect(tokenEstimate('€')).toBe(3)
    expect(tokenEstimate('😀')).toBe(4)
    expect(tokenEstimate('café')).toBe(3)
  })

  it('trims surrounding whitespace before counting', () => {
    expect(tokenEstimate('  hello  ')).toBe(tokenEstimate('hello'))
  })
})

describe('useTokenCounter', () => {
  it('starts at zero and estimates only after the debounce interval', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTokenCounter('hello', 300))

    expect(result.current).toEqual({ tokens: 0, isEstimating: true })

    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toEqual({ tokens: 0, isEstimating: true })

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toEqual({ tokens: 2, isEstimating: false })
  })

  it('keeps the previous count visible while the next estimate is pending', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ text }) => useTokenCounter(text, 300),
      { initialProps: { text: 'hello' } }
    )

    act(() => vi.advanceTimersByTime(300))
    expect(result.current.tokens).toBe(2)

    rerender({ text: 'hello world' })
    expect(result.current).toEqual({ tokens: 2, isEstimating: true })

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toEqual({ tokens: 6, isEstimating: false })
  })

  it('debounces rapid changes and estimates only the final text', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ text }) => useTokenCounter(text, 200),
      { initialProps: { text: 'one' } }
    )

    rerender({ text: 'one two' })
    act(() => vi.advanceTimersByTime(100))
    rerender({ text: 'one two three' })
    act(() => vi.advanceTimersByTime(100))

    expect(result.current).toEqual({ tokens: 0, isEstimating: true })

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toEqual({ tokens: 7, isEstimating: false })
  })

  it('clears its pending timer on unmount', () => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'clearTimeout')
    const { unmount } = renderHook(() => useTokenCounter('hello', 300))

    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    expect(globalThis.clearTimeout).toHaveBeenCalled()
  })

  it('uses the supplied debounce interval', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTokenCounter('hello', 50))

    act(() => vi.advanceTimersByTime(49))
    expect(result.current.isEstimating).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toEqual({ tokens: 2, isEstimating: false })
  })
})
