import { describe, expect, it } from 'vitest'
import { formatCost } from './formatting'

describe('formatCost values below the display floor', () => {
  it('renders the smallest positive double as less than one ten-thousandth', () => {
    expect(formatCost(Number.MIN_VALUE)).toBe('$<0.0001')
  })

  it('renders negative zero as a zero charge', () => {
    expect(formatCost(-0)).toBe('$0.00')
  })
})
