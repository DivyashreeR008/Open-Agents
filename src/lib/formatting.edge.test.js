import { describe, expect, it } from 'vitest'
import { formatCost, formatExactTime, formatRelativeTime } from './formatting'

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0)

describe('formatting edge values', () => {
  it('formats a zero amount without a currency symbol', () => {
    expect(formatCost(0, { symbol: false })).toBe('0.00')
    expect(formatCost(-0, { symbol: false })).toBe('0.00')
  })

  it('marks empty and non-finite timestamps as unknown', () => {
    expect(formatRelativeTime('', NOW)).toBe('unknown')
    expect(formatRelativeTime(NaN, NOW)).toBe('unknown')
    expect(formatRelativeTime(Infinity, NOW)).toBe('unknown')
    expect(formatExactTime('')).toBe('')
    expect(formatExactTime(NaN)).toBe('')
  })

  it('rejects numeric strings, objects, and negative non-finite costs', () => {
    expect(formatCost('0.25')).toBe('\u2014')
    expect(formatCost({ amount: 1 })).toBe('\u2014')
    expect(formatCost(-Infinity)).toBe('\u2014')
  })
})
