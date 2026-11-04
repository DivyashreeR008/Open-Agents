import { beforeEach, describe, expect, it } from 'vitest'
import {
  getAverageRating,
  getUserVote,
  loadListings,
  normalizeListing,
  rateAgent,
} from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'
const VOTES_KEY = 'oa_marketplace_votes'

function seedListing(overrides = {}) {
  const listing = {
    id: 'mkt_rating',
    name: 'Rating Target',
    description: 'A listing used for rating tests',
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

beforeEach(() => {
  localStorage.clear()
})

describe('marketplace rating lifecycle', () => {
  it('adds a first vote to the aggregate', () => {
    seedListing()

    const outcome = rateAgent('mkt_rating', 4)

    expect(outcome).toEqual({ average: 4, count: 1, vote: 4 })
    expect(getUserVote('mkt_rating')).toBe(4)
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 4, ratingCount: 1 })
  })

  it('replaces an existing vote without inflating the count', () => {
    seedListing()

    rateAgent('mkt_rating', 2)
    const outcome = rateAgent('mkt_rating', 5)

    expect(outcome).toEqual({ average: 5, count: 1, vote: 5 })
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 5, ratingCount: 1 })
  })

  it('retracts a vote with null and removes it from both aggregates', () => {
    seedListing()

    rateAgent('mkt_rating', 2)
    const outcome = rateAgent('mkt_rating', null)

    expect(outcome).toEqual({ average: 0, count: 0, vote: null })
    expect(getUserVote('mkt_rating')).toBeNull()
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 0, ratingCount: 0 })
  })

  it('accepts zero as the retract command', () => {
    seedListing()

    rateAgent('mkt_rating', 3)
    rateAgent('mkt_rating', 0)

    expect(getUserVote('mkt_rating')).toBeNull()
    expect(getAverageRating(loadListings()[0])).toBe(0)
  })

  it('does not create a vote when there is nothing to retract', () => {
    seedListing()

    const outcome = rateAgent('mkt_rating', null)

    expect(outcome).toEqual({ average: 0, count: 0, vote: null })
    expect(localStorage.getItem(VOTES_KEY)).toBeNull()
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 0, ratingCount: 0 })
  })

  it('rejects a non-numeric rating without touching storage', () => {
    seedListing()

    expect(rateAgent('mkt_rating', 'not-a-number')).toBeNull()
    expect(getUserVote('mkt_rating')).toBeNull()
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 0, ratingCount: 0 })
  })

  it('returns null for a listing that no longer exists', () => {
    seedListing()

    expect(rateAgent('missing', 5)).toBeNull()
  })
})

describe('normalizeListing rating fields', () => {
  it('coerces corrupt rating counters to safe defaults', () => {
    const listing = normalizeListing({
      id: 'mkt_bad',
      ratingTotal: 'many',
      ratingCount: -3,
      importCount: 'lots',
      publishedAt: 42,
    })

    expect(listing).toMatchObject({
      ratingTotal: 0,
      ratingCount: 0,
      importCount: 0,
      publishedAt: '',
    })
  })

  it('preserves valid counters and dates', () => {
    const listing = normalizeListing({
      id: 'mkt_good',
      ratingTotal: 9,
      ratingCount: 2,
      importCount: 7,
      publishedAt: '2026-01-02T03:04:05.000Z',
    })

    expect(listing).toMatchObject({
      ratingTotal: 9,
      ratingCount: 2,
      importCount: 7,
      publishedAt: '2026-01-02T03:04:05.000Z',
    })
  })
})
