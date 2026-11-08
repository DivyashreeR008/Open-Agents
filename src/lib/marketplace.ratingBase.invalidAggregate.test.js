import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { rateAgent } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'
const VOTES_KEY = 'oa_marketplace_votes'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

function seed(listing, vote) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify([listing]))
  localStorage.setItem(VOTES_KEY, JSON.stringify({ [listing.id]: vote }))
}

describe('rating aggregate repair during a vote change', () => {
  it('rebuilds from the new vote when removing the old vote would leave an impossible aggregate', () => {
    seed(
      {
        id: 'l1',
        name: 'Listing',
        ratingCount: 3,
        ratingTotal: 15,
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
      1
    )

    const outcome = rateAgent('l1', 5)

    expect(outcome).toMatchObject({ count: 1, vote: 5, average: 5 })
    const stored = JSON.parse(localStorage.getItem(LISTINGS_KEY))[0]
    expect(stored.ratingCount).toBe(1)
    expect(stored.ratingTotal).toBe(5)
  })

  it('rebuilds from the new vote when the old vote exceeds the stored total', () => {
    seed(
      {
        id: 'l2',
        name: 'Listing',
        ratingCount: 1,
        ratingTotal: 2,
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
      5
    )

    const outcome = rateAgent('l2', 4)

    expect(outcome).toMatchObject({ count: 1, vote: 4, average: 4 })
  })
})
