import { describe, expect, it } from 'vitest'
import { filterListings } from './marketplace'

describe('filterListings numeric tags', () => {
  it('matches the string form of a non-string tag', () => {
    const listings = [{ id: 'l1', name: 'Agent', tags: [42] }]

    expect(filterListings(listings, { search: '42' })).toEqual(listings)
  })
})
