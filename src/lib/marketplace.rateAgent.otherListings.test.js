import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { filterListings, rateAgent } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('rating and filtering with neighbouring records', () => {
  it('leaves other listings untouched when one listing is rated', () => {
    const listings = [
      { id: 'a', name: 'A', ratingCount: 0, ratingTotal: 0, publishedAt: '2026-01-01' },
      { id: 'b', name: 'B', ratingCount: 2, ratingTotal: 8, publishedAt: '2026-01-02' },
    ]
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings))

    rateAgent('a', 5)

    const stored = JSON.parse(localStorage.getItem(LISTINGS_KEY))
    expect(stored.find((item) => item.id === 'b')).toMatchObject({
      ratingCount: 2,
      ratingTotal: 8,
    })
  })

  it('filters a listing without a name without throwing', () => {
    const result = filterListings([{ id: 'a', tags: ['searchable'] }], { search: 'missing' })
    expect(result).toEqual([])
  })

  it('finds a listing by tag even when the name is missing', () => {
    const result = filterListings([{ id: 'a', tags: ['searchable'] }], { search: 'search' })
    expect(result).toHaveLength(1)
  })
})
