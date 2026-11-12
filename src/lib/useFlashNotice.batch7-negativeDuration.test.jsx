import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFlashNotice } from './useFlashNotice'

afterEach(() => vi.useRealTimers())

describe('useFlashNotice negative duration', () => {
  it('clears the notice on the next timer tick', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useFlashNotice(-5))

    act(() => result.current.flash('Saved'))
    expect(result.current.notice).toBe('Saved')

    act(() => vi.advanceTimersByTime(0))
    expect(result.current.notice).toBeNull()
  })
})
