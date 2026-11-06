import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  formatCost,
  formatExactTime,
  formatRelativeTime,
  useNow,
} from './formatting'

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0)

afterEach(() => {
  vi.useRealTimers()
})

describe('formatRelativeTime', () => {
  it('describes recent ages at each boundary', () => {
    expect(formatRelativeTime(NOW - 30_000, NOW)).toBe('just now')
    expect(formatRelativeTime(NOW - 60_000, NOW)).toBe('1m ago')
    expect(formatRelativeTime(NOW - 59 * 60_000, NOW)).toBe('59m ago')
    expect(formatRelativeTime(NOW - 60 * 60_000, NOW)).toBe('1h ago')
    expect(formatRelativeTime(NOW - 23 * 60 * 60_000, NOW)).toBe('23h ago')
    expect(formatRelativeTime(NOW - 24 * 60 * 60_000, NOW)).toBe('1d ago')
    expect(formatRelativeTime(NOW - 3 * 24 * 60 * 60_000, NOW)).toBe('3d ago')
  })

  it('accepts date strings and Date objects', () => {
    const fiveMinutesAgo = new Date(NOW - 5 * 60_000)
    expect(formatRelativeTime(fiveMinutesAgo.toISOString(), NOW)).toBe('5m ago')
    expect(formatRelativeTime(fiveMinutesAgo, NOW)).toBe('5m ago')
  })

  it('clamps future timestamps and labels invalid ones honestly', () => {
    expect(formatRelativeTime(NOW + 60_000, NOW)).toBe('just now')
    expect(formatRelativeTime('not-a-date', NOW)).toBe('unknown')
    expect(formatRelativeTime(undefined, NOW)).toBe('unknown')
  })
})

describe('formatExactTime', () => {
  it('returns a readable local timestamp for valid input', () => {
    expect(formatExactTime(NOW)).not.toBe('')
    expect(formatExactTime('2026-01-15T12:00:00.000Z')).not.toBe('')
  })

  it('returns an empty string for invalid input', () => {
    expect(formatExactTime('later')).toBe('')
    expect(formatExactTime(null)).toBe('')
  })
})

describe('formatCost', () => {
  it('never renders a nonzero charge as zero', () => {
    expect(formatCost(0.004)).toBe('$0.004')
    expect(formatCost(0.0007)).toBe('$0.0007')
    expect(formatCost(0.00001)).toBe('$<0.0001')
    expect(formatCost(0.00001)).not.toBe('$0.00')
  })

  it('adapts precision to the size of the amount', () => {
    expect(formatCost(0)).toBe('$0.00')
    expect(formatCost(0.0001)).toBe('$0.0001')
    expect(formatCost(0.0123)).toBe('$0.012')
    expect(formatCost(1)).toBe('$1.00')
    expect(formatCost(12.345)).toBe('$12.35')
  })

  it('can omit the dollar sign for surfaces that render their own symbol', () => {
    expect(formatCost(0.004, { symbol: false })).toBe('0.004')
    expect(formatCost(0.00001, { symbol: false })).toBe('<0.0001')
  })

  it('rejects missing, invalid, and negative amounts', () => {
    expect(formatCost(null)).toBe('\u2014')
    expect(formatCost(undefined)).toBe('\u2014')
    expect(formatCost(NaN)).toBe('\u2014')
    expect(formatCost(Infinity)).toBe('\u2014')
    expect(formatCost(-0.01)).toBe('\u2014')
  })
})

describe('useNow', () => {
  it('refreshes on the requested interval and stops after unmount', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW))

    const { result, unmount } = renderHook(() => useNow(30_000))
    expect(result.current).toBe(NOW)

    act(() => {
      vi.advanceTimersByTime(30_000)
    })
    expect(result.current).toBe(NOW + 30_000)

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(result.current).toBe(NOW + 90_000)

    unmount()
    act(() => {
      vi.advanceTimersByTime(30_000)
    })
    expect(vi.getTimerCount()).toBe(0)
  })
})
