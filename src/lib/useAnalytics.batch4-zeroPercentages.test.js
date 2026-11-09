import { describe, expect, it } from 'vitest'
import { allocateRoundedPercentages } from './useAnalytics'

describe('analytics percentage allocation zero total', () => {
  it('keeps item metadata and assigns zero percentages', () => {
    expect(
      allocateRoundedPercentages([
        { name: 'a', count: 0 },
        { name: 'b', count: 0 },
      ])
    ).toEqual([
      { name: 'a', count: 0, pct: 0 },
      { name: 'b', count: 0, pct: 0 },
    ])
    expect(allocateRoundedPercentages([])).toEqual([])
  })
})
