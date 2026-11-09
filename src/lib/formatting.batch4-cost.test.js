import { describe, expect, it } from 'vitest'
import { formatCost } from './formatting'

describe('cost formatting precision', () => {
  it('uses a dash for invalid or negative amounts', () => {
    expect(formatCost(null)).toBe('\u2014')
    expect(formatCost('1.00')).toBe('\u2014')
    expect(formatCost(Number.NaN)).toBe('\u2014')
    expect(formatCost(-0.01)).toBe('\u2014')
  })

  it('keeps small nonzero charges visible', () => {
    expect(formatCost(0)).toBe('$0.00')
    expect(formatCost(1.234)).toBe('$1.23')
    expect(formatCost(0.5)).toBe('$0.5')
    expect(formatCost(0.00001)).toBe('$<0.0001')
    expect(formatCost(0.5, { symbol: false })).toBe('0.5')
  })
})
