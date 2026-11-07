import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTimedState } from './useTimedState'

afterEach(() => vi.useRealTimers())

describe('useTimedState guards', () => {
  it('sets a value without scheduling a reset for a zero delay', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTimedState('idle'))

    act(() => result.current[1]('copied', 0))

    expect(result.current[0]).toBe('copied')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('ignores updates while disabled', () => {
    const { result } = renderHook(() => useTimedState('idle', false))

    act(() => result.current[1]('ignored', 1000))

    expect(result.current[0]).toBe('idle')
  })

  it('resets to a new initial value when the surface becomes disabled', () => {
    const { result, rerender } = renderHook(
      ({ initial, enabled }) => useTimedState(initial, enabled),
      { initialProps: { initial: 'first', enabled: true } }
    )

    act(() => result.current[1]('temporary', 5000))
    expect(result.current[0]).toBe('temporary')

    rerender({ initial: 'second', enabled: false })

    expect(result.current[0]).toBe('second')
  })
})
