import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tokenEstimate, useTokenCounter } from './useTokenCounter'

describe('useTokenCounter whitespace tokens', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts tabs and newlines between single-letter words', () => {
    expect(tokenEstimate('a\tb')).toBe(3)
    expect(tokenEstimate('a\nb')).toBe(3)
    expect(tokenEstimate('a\tb\nc')).toBe(6)
    expect(tokenEstimate('a\t\nb')).toBe(4)

    vi.useFakeTimers()
    const { result } = renderHook(() => useTokenCounter('a\tb\nc', 50))
    expect(result.current.isEstimating).toBe(true)
    act(() => vi.advanceTimersByTime(50))
    expect(result.current.tokens).toBe(6)
    expect(result.current.isEstimating).toBe(false)
  })
})
