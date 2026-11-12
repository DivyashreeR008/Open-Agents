import { describe, expect, it } from 'vitest'
import { sortListings } from './marketplace'

describe('sortListings import ties', () => {
  it('uses the higher rating when import counts match', () => {
    const listings = [
      { id: 'low', importCount: 3, ratingCount: 1, ratingTotal: 4 },
      { id: 'high', importCount: 3, ratingCount: 1, ratingTotal: 5 },
    ]

    expect(sortListings(listings, 'imports').map((listing) => listing.id)).toEqual(['high', 'low'])
  })
})
