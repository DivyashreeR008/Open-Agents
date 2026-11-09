import { describe, expect, it } from 'vitest'
import { getAverageRating } from './marketplace'

describe('marketplace average rating bounds', () => {
  it('returns zero for missing, empty, and impossible aggregates', () => {
    expect(getAverageRating(null)).toBe(0)
    expect(getAverageRating({ ratingTotal: 0, ratingCount: 0 })).toBe(0)
    expect(getAverageRating({ ratingTotal: 2, ratingCount: 3 })).toBe(0)
    expect(getAverageRating({ ratingTotal: 20, ratingCount: 3 })).toBe(0)
  })

  it('rounds a valid aggregate to one decimal place', () => {
    expect(getAverageRating({ ratingTotal: 13, ratingCount: 3 })).toBe(4.3)
  })
})
