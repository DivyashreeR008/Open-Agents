import { describe, expect, it } from 'vitest'
import { sortListings } from './marketplace'

describe('marketplace sort tie breaks', () => {
  it('orders equal old dates by id and rating ties by count', () => {
    const oldest = sortListings(
      [
        { id: 'b', publishedAt: '2026-01-01T00:00:00.000Z' },
        { id: 'a', publishedAt: '2026-01-01T00:00:00.000Z' },
      ],
      'oldest'
    )
    expect(oldest.map((l) => l.id)).toEqual(['a', 'b'])

    const rated = sortListings(
      [
        { id: 'few', ratingTotal: 4, ratingCount: 1, publishedAt: '2026-01-01T00:00:00.000Z' },
        { id: 'many', ratingTotal: 8, ratingCount: 2, publishedAt: '2026-01-01T00:00:00.000Z' },
      ],
      'rating'
    )
    expect(rated.map((l) => l.id)).toEqual(['many', 'few'])
  })

  it('places unknown dates last in both directions', () => {
    const entries = [
      { id: 'unknown', publishedAt: 'not-a-date' },
      { id: 'new', publishedAt: '2026-02-01T00:00:00.000Z' },
      { id: 'old', publishedAt: '2026-01-01T00:00:00.000Z' },
    ]

    expect(sortListings(entries, 'newest').at(-1).id).toBe('unknown')
    expect(sortListings(entries, 'oldest').at(-1).id).toBe('unknown')
  })
})
