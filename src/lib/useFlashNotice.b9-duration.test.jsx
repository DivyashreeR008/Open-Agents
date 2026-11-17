import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFlashNotice } from './useFlashNotice'

describe('useFlashNotice duration changes', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('restarts an active notice with the new duration', () => {
    const { result, rerender } = renderHook(({ duration }) => useFlashNotice(duration), {
      initialProps: { duration: 3500 },
    })

    act(() => result.current.flash('Saved'))
    act(() => vi.advanceTimersByTime(1000))

    rerender({ duration: 500 })
    expect(result.current.notice).toBe('Saved')

    act(() => vi.advanceTimersByTime(499))
    expect(result.current.notice).toBe('Saved')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.notice).toBeNull()
  })

  it('does not create a timer when no notice is showing', () => {
    const { rerender } = renderHook(({ duration }) => useFlashNotice(duration), {
      initialProps: { duration: 3500 },
    })

    rerender({ duration: 100 })

    expect(vi.getTimerCount()).toBe(0)
  })

  it('keeps only one timer when the duration changes twice', () => {
    const { result, rerender } = renderHook(({ duration }) => useFlashNotice(duration), {
      initialProps: { duration: 3500 },
    })

    act(() => result.current.flash('Saved'))
    rerender({ duration: 1000 })
    rerender({ duration: 200 })

    expect(vi.getTimerCount()).toBe(1)
    act(() => vi.advanceTimersByTime(200))
    expect(result.current.notice).toBeNull()
  })
})
