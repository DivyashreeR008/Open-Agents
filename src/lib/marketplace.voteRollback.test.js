import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rateAgent } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'
const VOTES_KEY = 'oa_marketplace_votes'

const listing = {
  id: 'rollback-listing',
  name: 'Rollback Listing',
  ratingCount: 1,
  ratingTotal: 4,
  publishedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(LISTINGS_KEY, JSON.stringify([listing]))
  localStorage.setItem(VOTES_KEY, JSON.stringify({ [listing.id]: 4 }))
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('rating rollback when the aggregate write fails', () => {
  it('restores the personal vote and reports no success', () => {
    const originalSetItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function setItem(key, value) {
      if (key === LISTINGS_KEY) throw new Error('QuotaExceededError')
      return originalSetItem.call(this, key, value)
    })

    expect(rateAgent(listing.id, 5)).toBeNull()
    expect(JSON.parse(localStorage.getItem(VOTES_KEY))).toEqual({ [listing.id]: 4 })
    expect(JSON.parse(localStorage.getItem(LISTINGS_KEY))).toEqual([listing])
  })
})
