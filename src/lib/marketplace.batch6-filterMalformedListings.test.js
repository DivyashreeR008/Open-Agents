import { describe, expect, it } from 'vitest'
import { filterListings } from './marketplace'

describe('marketplace filtering with malformed data', () => {
  it('ignores null records and keeps matching listings', () => {
    const listings = [null, { name: 'Alpha agent', tags: ['beta'] }]
    expect(filterListings(listings, { search: 'alpha' })).toEqual([listings[1]])
  })

  it('returns an empty list when the input is not an array', () => {
    expect(filterListings(null, { search: 'alpha' })).toEqual([])
  })
})
