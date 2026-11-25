import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimedState } from './useTimedState'

afterEach(() => vi.useRealTimers())

describe('useTimedState negative delay', () => {
  it('updates immediately without scheduling a reset when delayMs is negative', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTimedState('initial'))

    act(() => result.current[1]('updated', -500))
    expect(result.current[0]).toBe('updated')
    expect(vi.getTimerCount()).toBe(0)

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current[0]).toBe('updated')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('updates immediately without scheduling a reset when delayMs is zero', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTimedState('initial'))

    act(() => result.current[1]('zero-delay', 0))
    expect(result.current[0]).toBe('zero-delay')
    expect(vi.getTimerCount()).toBe(0)

    act(() => vi.advanceTimersByTime(2000))
    expect(result.current[0]).toBe('zero-delay')
    expect(vi.getTimerCount()).toBe(0)
  })
})
