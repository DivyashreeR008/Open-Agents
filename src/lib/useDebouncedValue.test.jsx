import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebouncedValue', () => {
  it('returns the initial value immediately', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useDebouncedValue('draws', 250))

    expect(result.current).toBe('draws')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('holds updates until the delay has passed', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 250), {
      initialProps: { value: '' },
    })

    rerender({ value: 'draws' })
    expect(result.current).toBe('')

    act(() => vi.advanceTimersByTime(249))
    expect(result.current).toBe('')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('draws')
  })

  it('coalesces rapid changes and only applies the final value', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: '' },
    })

    rerender({ value: 'd' })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: 'dr' })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: 'draws' })
    act(() => vi.advanceTimersByTime(100))

    expect(result.current).toBe('')

    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('draws')
  })

  it('cancels a pending update when the value returns to the current value', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: 'alpha' },
    })

    rerender({ value: 'beta' })
    rerender({ value: 'alpha' })

    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('alpha')
  })

  it('clears its timer when unmounted', () => {
    vi.useFakeTimers()
    const { rerender, unmount } = renderHook(({ value }) => useDebouncedValue(value, 250), {
      initialProps: { value: '' },
    })

    rerender({ value: 'draws' })
    expect(vi.getTimerCount()).toBe(1)

    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
