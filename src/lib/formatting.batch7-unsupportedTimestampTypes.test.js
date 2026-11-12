import { describe, expect, it } from 'vitest'
import { formatExactTime, formatRelativeTime } from './formatting'

describe('formatting unsupported timestamp types', () => {
  it('reports an unknown relative time for booleans and arrays', () => {
    expect(formatRelativeTime(true, 1_000_000)).toBe('unknown')
    expect(formatRelativeTime([2026, 0, 1], 1_000_000)).toBe('unknown')
    expect(formatRelativeTime({ at: 1_000_000 }, 1_000_000)).toBe('unknown')
  })

  it('returns an empty exact time for booleans and objects', () => {
    expect(formatExactTime(false)).toBe('')
    expect(formatExactTime({ at: 1_000_000 })).toBe('')
  })

  it('still accepts numeric strings and Date instances', () => {
    expect(formatRelativeTime(new Date(1_000_000 - 90_000).toISOString(), 1_000_000)).toBe('1m ago')
    expect(formatRelativeTime(new Date(1_000_000 - 3_600_000), 1_000_000)).toBe('1h ago')
  })
})
