import { describe, expect, it } from 'vitest'
import { sortListings } from './marketplace'

describe('sortListings unknown sort', () => {
  it('falls back to newest first', () => {
    const listings = [
      { id: 'old', publishedAt: '2026-01-01T00:00:00Z' },
      { id: 'new', publishedAt: '2026-02-01T00:00:00Z' },
    ]

    expect(sortListings(listings, 'surprise').map((listing) => listing.id)).toEqual(['new', 'old'])
  })
})
