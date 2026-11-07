import { describe, expect, it } from 'vitest'
import { sortListings } from './marketplace'

const names = (items) => items.map((listing) => listing.name)

describe('marketplace sort tiebreaks', () => {
  it('orders equal timestamps by id in both age directions', () => {
    const listings = [
      { id: 'b', name: 'Beta', publishedAt: '2026-03-01T12:00:00.000Z' },
      { id: 'a', name: 'Alpha', publishedAt: '2026-03-01T12:00:00.000Z' },
    ]

    expect(names(sortListings(listings, 'newest'))).toEqual(['Alpha', 'Beta'])
    expect(names(sortListings(listings, 'oldest'))).toEqual(['Alpha', 'Beta'])
  })

  it('sorts unknown dates last and preserves id order when both dates are unknown', () => {
    const listings = [
      { id: 'z', name: 'Unknown Z', publishedAt: 'not-a-date' },
      { id: 'a', name: 'Unknown A', publishedAt: '' },
      { id: 'm', name: 'Known', publishedAt: '2026-03-01T12:00:00.000Z' },
    ]

    expect(names(sortListings(listings, 'newest'))).toEqual(['Known', 'Unknown A', 'Unknown Z'])
    expect(names(sortListings(listings, 'oldest'))).toEqual(['Known', 'Unknown A', 'Unknown Z'])
  })

  it('falls back from import count to rating and then to newest publication', () => {
    const listings = [
      {
        id: 'low',
        name: 'Low Rated',
        importCount: 4,
        ratingTotal: 3,
        ratingCount: 1,
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'high',
        name: 'High Rated',
        importCount: 4,
        ratingTotal: 9,
        ratingCount: 2,
        publishedAt: '2026-01-02T00:00:00.000Z',
      },
      {
        id: 'newer',
        name: 'Newer Equal',
        importCount: 4,
        ratingTotal: 5,
        ratingCount: 1,
        publishedAt: '2026-01-03T00:00:00.000Z',
      },
      {
        id: 'older',
        name: 'Older Equal',
        importCount: 4,
        ratingTotal: 5,
        ratingCount: 1,
        publishedAt: '2026-01-02T12:00:00.000Z',
      },
    ]

    expect(names(sortListings(listings, 'imports'))).toEqual([
      'Newer Equal',
      'Older Equal',
      'High Rated',
      'Low Rated',
    ])
  })
})
