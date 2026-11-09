import { describe, expect, it } from 'vitest'
import { formatExactTime, formatRelativeTime } from './formatting'

describe('relative and exact timestamp formatting', () => {
  const now = new Date('2026-01-02T12:00:00.000Z').getTime()

  it('returns unknown for invalid values and clamps future timestamps', () => {
    expect(formatRelativeTime(null, now)).toBe('unknown')
    expect(formatRelativeTime('not-a-date', now)).toBe('unknown')
    expect(formatRelativeTime(now + 60_000, now)).toBe('just now')
  })

  it('formats minutes, hours, days, and Date instances', () => {
    expect(formatRelativeTime(now - 90_000, now)).toBe('1m ago')
    expect(formatRelativeTime(now - 2 * 3_600_000, now)).toBe('2h ago')
    expect(formatRelativeTime(new Date(now - 3 * 86_400_000), now)).toBe('3d ago')
    expect(formatExactTime('not-a-date')).toBe('')
  })
})
