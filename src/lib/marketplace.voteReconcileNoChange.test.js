import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadListings } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'
const VOTES_KEY = 'oa_marketplace_votes'

describe('marketplace vote reconciliation no-op path', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('does not rewrite listings or votes when both records are already consistent', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        {
          id: 'mkt_1',
          name: 'Consistent listing',
          ratingCount: 2,
          ratingTotal: 8,
          publishedAt: '2026-01-01T00:00:00.000Z',
        },
      ])
    )
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_1: 4 }))
    const setItem = vi.spyOn(Storage.prototype, 'setItem')

    const [listing] = loadListings()

    expect(listing).toMatchObject({ ratingCount: 2, ratingTotal: 8 })
    expect(setItem).not.toHaveBeenCalled()
  })
})
