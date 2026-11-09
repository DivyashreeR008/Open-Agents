import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFlashNotice } from './useFlashNotice'

describe('flash notice repeated message', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('restarts the display window when the same message is flashed again', () => {
    const { result } = renderHook(() => useFlashNotice(1000))

    act(() => result.current.flash('Saved'))
    act(() => vi.advanceTimersByTime(700))
    act(() => result.current.flash('Saved'))

    act(() => vi.advanceTimersByTime(999))
    expect(result.current.notice).toBe('Saved')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.notice).toBeNull()
  })
})
