import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadListings, rateAgent } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'
const VOTES_KEY = 'oa_marketplace_votes'

function seedListing(overrides = {}) {
  const listing = {
    id: 'mkt_reconcile',
    name: 'Reconcile Target',
    description: 'A listing used to exercise rating repair',
    tags: [],
    category: 'Research',
    author: 'Tester',
    config: {},
    sanitizedFields: [],
    importCount: 0,
    ratingTotal: 0,
    ratingCount: 0,
    publishedAt: '2026-03-01T12:00:00.000Z',
    ...overrides,
  }
  localStorage.setItem(LISTINGS_KEY, JSON.stringify([listing]))
  return listing
}

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('marketplace rating reconciliation', () => {
  it('rebuilds an aggregate whose total is lower than the stored vote', () => {
    seedListing({ ratingTotal: 2, ratingCount: 1 })
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_reconcile: 5 }))

    const outcome = rateAgent('mkt_reconcile', 4)

    expect(outcome).toEqual({ average: 4, count: 1, vote: 4 })
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 4, ratingCount: 1 })
  })

  it('resets a total that is impossible for the stored vote count', () => {
    seedListing({ ratingTotal: 1, ratingCount: 2 })

    const outcome = rateAgent('mkt_reconcile', 3)

    expect(outcome).toEqual({ average: 3, count: 1, vote: 3 })
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 3, ratingCount: 1 })
  })

  it('returns the stored outcome unchanged when the same vote is submitted again', () => {
    seedListing({ ratingTotal: 4, ratingCount: 1 })
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_reconcile: 4 }))
    const before = localStorage.getItem(LISTINGS_KEY)

    const outcome = rateAgent('mkt_reconcile', 4)

    expect(outcome).toEqual({ average: 4, count: 1, vote: 4 })
    expect(localStorage.getItem(LISTINGS_KEY)).toBe(before)
  })
})
