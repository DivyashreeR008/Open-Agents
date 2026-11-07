import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFlashNotice } from './useFlashNotice'

describe('useFlashNotice zero duration', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('clears a notice on the next timer turn without leaving a timer behind', () => {
    const { result } = renderHook(() => useFlashNotice(0))

    act(() => result.current.flash('Immediate'))
    expect(result.current.notice).toBe('Immediate')

    act(() => vi.advanceTimersByTime(0))

    expect(result.current.notice).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })
})
