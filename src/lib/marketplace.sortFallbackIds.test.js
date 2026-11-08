import { describe, expect, it } from 'vitest'
import { sortListings } from './marketplace'

describe('sort fallbacks for missing metadata', () => {
  it('sorts listings with missing dates and ids without throwing', () => {
    const listings = [{ publishedAt: '' }, { publishedAt: 'not-a-date' }]
    const sorted = sortListings(listings, 'newest')
    expect(sorted).toHaveLength(2)
    expect(sorted).not.toBe(listings)
  })

  it('sorts equal unknown dates by the empty id fallback', () => {
    const listings = [{ publishedAt: '' }, { publishedAt: '' }]
    expect(sortListings(listings, 'oldest')).toHaveLength(2)
  })

  it('breaks rating ties with missing vote counts', () => {
    const listings = [
      { id: 'a', ratingCount: undefined, ratingTotal: 0, publishedAt: '2026-01-01' },
      { id: 'b', ratingCount: undefined, ratingTotal: 0, publishedAt: '2026-01-01' },
    ]
    expect(sortListings(listings, 'rating')).toHaveLength(2)
  })

  it('breaks import ties with missing counts and ratings', () => {
    const listings = [
      { id: 'a', importCount: undefined, ratingCount: undefined, publishedAt: '2026-01-01' },
      { id: 'b', importCount: undefined, ratingCount: undefined, publishedAt: '2026-01-01' },
    ]
    expect(sortListings(listings, 'imports')).toHaveLength(2)
  })
})
