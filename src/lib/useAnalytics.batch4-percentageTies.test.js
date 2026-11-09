import { describe, expect, it } from 'vitest'
import { allocateRoundedPercentages } from './useAnalytics'

describe('percentage allocation tie handling', () => {
  it('awards leftover points by original order and still totals one hundred', () => {
    const result = allocateRoundedPercentages([
      { name: 'a', count: 1 },
      { name: 'b', count: 1 },
      { name: 'c', count: 1 },
    ])

    expect(result.map((item) => item.pct)).toEqual([34, 33, 33])
    expect(result.reduce((sum, item) => sum + item.pct, 0)).toBe(100)
  })

  it('keeps every percentage at zero when there is nothing to allocate', () => {
    expect(allocateRoundedPercentages([{ name: 'empty', count: 0 }])).toEqual([
      { name: 'empty', count: 0, pct: 0 },
    ])
  })
})
