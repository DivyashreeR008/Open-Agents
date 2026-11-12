import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimedState } from './useTimedState'

afterEach(() => vi.useRealTimers())

describe('useTimedState negative delay', () => {
  it('updates immediately without scheduling a reset', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useTimedState('initial'))

    act(() => result.current[1]('next', -10))
    expect(result.current[0]).toBe('next')

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current[0]).toBe('next')
  })
})
