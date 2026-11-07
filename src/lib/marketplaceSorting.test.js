import { describe, expect, it } from 'vitest'
import { sortListings } from './marketplace'

const listings = [
  {
    id: 'alpha',
    name: 'Alpha',
    publishedAt: '2026-03-01T12:00:00.000Z',
    ratingTotal: 5,
    ratingCount: 1,
    importCount: 1,
  },
  {
    id: 'beta',
    name: 'Beta',
    publishedAt: '2026-02-01T12:00:00.000Z',
    ratingTotal: 6,
    ratingCount: 2,
    importCount: 10,
  },
  {
    id: 'gamma',
    name: 'Gamma',
    publishedAt: '2026-01-01T12:00:00.000Z',
    ratingTotal: 0,
    ratingCount: 0,
    importCount: 3,
  },
]

const names = (items) => items.map((listing) => listing.name)

describe('sortListings', () => {
  it('orders by newest and oldest without mutating the input', () => {
    const original = [...listings]

    expect(names(sortListings(listings, 'newest'))).toEqual(['Alpha', 'Beta', 'Gamma'])
    expect(names(sortListings(listings, 'oldest'))).toEqual(['Gamma', 'Beta', 'Alpha'])
    expect(listings).toEqual(original)
  })

  it('puts unknown publication dates last in both age directions', () => {
    const withUnknown = [
      ...listings,
      {
        id: 'unknown',
        name: 'Unknown',
        publishedAt: '',
        ratingTotal: 0,
        ratingCount: 0,
        importCount: 0,
      },
    ]

    expect(names(sortListings(withUnknown, 'newest')).at(-1)).toBe('Unknown')
    expect(names(sortListings(withUnknown, 'oldest')).at(-1)).toBe('Unknown')
  })

  it('orders by average rating and breaks ties with the vote count', () => {
    const tied = [
      {
        id: 'a',
        name: 'OneVote',
        ratingTotal: 5,
        ratingCount: 1,
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'b',
        name: 'TwoVotes',
        ratingTotal: 10,
        ratingCount: 2,
        publishedAt: '2026-01-02T00:00:00.000Z',
      },
      {
        id: 'c',
        name: 'Low',
        ratingTotal: 3,
        ratingCount: 1,
        publishedAt: '2026-01-03T00:00:00.000Z',
      },
    ]

    expect(names(sortListings(tied, 'rating'))).toEqual(['TwoVotes', 'OneVote', 'Low'])
  })

  it('orders by import count and falls back to rating', () => {
    expect(names(sortListings(listings, 'imports'))).toEqual(['Beta', 'Gamma', 'Alpha'])
  })

  it('returns an empty array for a non-array input and defaults to newest', () => {
    expect(sortListings(null)).toEqual([])
    expect(names(sortListings(listings, 'unknown-order'))).toEqual(['Alpha', 'Beta', 'Gamma'])
  })
})
