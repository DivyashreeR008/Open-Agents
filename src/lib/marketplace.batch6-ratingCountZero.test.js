import { describe, expect, it } from 'vitest'
import { normalizeListing } from './marketplace'

describe('marketplace rating normalization at zero count', () => {
  it('drops a positive total when no votes were recorded', () => {
    const listing = normalizeListing({
      id: 'listing-zero',
      name: 'Zero votes',
      ratingCount: 0,
      ratingTotal: 5,
    })

    expect(listing.ratingCount).toBe(0)
    expect(listing.ratingTotal).toBe(0)
  })
})
