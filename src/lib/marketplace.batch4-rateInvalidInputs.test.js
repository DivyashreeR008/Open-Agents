import { afterEach, describe, expect, it } from 'vitest'
import { loadListings, publishAgent, rateAgent } from './marketplace'

describe('marketplace rating invalid inputs', () => {
  afterEach(() => localStorage.clear())

  it('returns null for an unknown listing and a non-numeric rating', () => {
    expect(rateAgent('missing', 5)).toBeNull()

    const listing = publishAgent({
      name: 'Rated agent',
      description: 'd',
      tags: [],
      category: 'Research',
      config: {},
    })

    expect(rateAgent(listing.id, 'excellent')).toBeNull()
    expect(loadListings()[0].ratingCount).toBe(0)
  })
})
