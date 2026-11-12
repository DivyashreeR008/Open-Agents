import { describe, expect, it } from 'vitest'
import { getAverageRating } from './marketplace'

describe('getAverageRating non-finite totals', () => {
  it('returns zero for an infinite total', () => {
    expect(getAverageRating({ ratingCount: 1, ratingTotal: Infinity })).toBe(0)
  })
})
