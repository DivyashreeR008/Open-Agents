import { describe, expect, it } from 'vitest'
import { filterListings } from './marketplace'

describe('marketplace filter non-string fields', () => {
  it('uses safe empty values when names and tags are missing', () => {
    const listings = [
      { id: 'a', name: null, tags: null, category: 'Research' },
      { id: 'b', name: 42, tags: [null, 7], category: 'Research' },
      { id: 'c', name: 'Useful', tags: ['Data'], category: 'Research' },
    ]

    expect(filterListings(listings)).toHaveLength(3)
    expect(filterListings(listings, { search: 'useful' }).map((l) => l.id)).toEqual(['c'])
    expect(filterListings(listings, { search: 'data' }).map((l) => l.id)).toEqual(['c'])
    expect(filterListings(listings, { search: '', category: 'Research' })).toHaveLength(3)
  })
})
