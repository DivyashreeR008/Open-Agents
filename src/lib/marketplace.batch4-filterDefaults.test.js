import { describe, expect, it } from 'vitest'
import { filterListings } from './marketplace'

const listings = [
  { id: 'a', name: 'Alpha Writer', category: 'Research', tags: ['seo'] },
  { id: 'b', name: 'Beta Reader', category: 'Data Processing', tags: ['csv'] },
  { id: 'c', name: '', category: 'Research', tags: ['Alpha'] },
]

describe('marketplace filter defaults', () => {
  it('returns all listings when no filter object is provided', () => {
    expect(filterListings(listings)).toHaveLength(3)
  })

  it('trims the search term and matches names or tags case-insensitively', () => {
    expect(filterListings(listings, { search: '  ALPHA  ' }).map((l) => l.id)).toEqual(['a', 'c'])
    expect(filterListings(listings, { search: 'csv' }).map((l) => l.id)).toEqual(['b'])
  })

  it('combines category and search filters', () => {
    expect(
      filterListings(listings, { search: 'alpha', category: 'Research' }).map((l) => l.id)
    ).toEqual(['a', 'c'])
    expect(filterListings(listings, { category: 'Missing' })).toEqual([])
  })
})
