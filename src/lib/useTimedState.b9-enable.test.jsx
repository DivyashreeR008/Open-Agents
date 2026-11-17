import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTimedState } from './useTimedState'

afterEach(() => vi.useRealTimers())

describe('useTimedState enabled transitions', () => {
  it('returns the initial value as soon as the surface is disabled', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ enabled }) => useTimedState('idle', enabled), {
      initialProps: { enabled: true },
    })

    act(() => result.current[1]('saved', 5000))
    expect(result.current[0]).toBe('saved')

    rerender({ enabled: false })

    expect(result.current[0]).toBe('idle')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not restart the timer when only the initial value identity changes', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ initial }) => useTimedState(initial, true), {
      initialProps: { initial: { label: 'idle' } },
    })

    act(() => result.current[1]('copied', 1000))
    rerender({ initial: { label: 'idle' } })
    act(() => vi.advanceTimersByTime(1000))

    expect(result.current[0]).toEqual({ label: 'idle' })
  })

  it('never shows a stale value after being re-enabled', () => {
    const { result, rerender } = renderHook(({ enabled }) => useTimedState('idle', enabled), {
      initialProps: { enabled: true },
    })

    act(() => result.current[1]('saved', 0))
    rerender({ enabled: false })
    rerender({ enabled: true })

    expect(result.current[0]).toBe('idle')
  })
})
