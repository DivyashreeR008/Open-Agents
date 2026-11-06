import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAverageRating,
  getUserVote,
  loadListings,
  loadUserVotes,
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

afterEach(() => {
  vi.restoreAllMocks()
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

  it('rejects entries that cannot be rendered as a listing', () => {
    expect(normalizeListing(null)).toBeNull()
    expect(normalizeListing('not a listing')).toBeNull()
    expect(normalizeListing(42)).toBeNull()
    expect(normalizeListing([])).toBeNull()
    expect(normalizeListing({ name: 'No id' })).toBeNull()
  })

  it('skips damaged records without discarding the valid ones', () => {
    const good = { ...seedListing(), id: 'mkt_survivor' }
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([null, 'broken', 5, [], good, { name: 'No id' }])
    )

    expect(loadListings().map((listing) => listing.id)).toEqual(['mkt_survivor'])
  })

  it('resets an aggregate that no set of whole-star ratings could produce', () => {
    const listing = normalizeListing({
      id: 'mkt_impossible',
      ratingTotal: 99,
      ratingCount: 3,
    })

    expect(listing).toMatchObject({ ratingTotal: 0, ratingCount: 0 })
    expect(getAverageRating(listing)).toBe(0)
    expect(getAverageRating({ ratingTotal: 99, ratingCount: 3 })).toBe(0)
  })
})

describe('marketplace rating reconciliation', () => {
  it('rebuilds a missing total from the stored personal vote before re-rating', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ ratingTotal: undefined, ratingCount: 1 })])
    )
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_rating: 5 }))

    const outcome = rateAgent('mkt_rating', 3)

    expect(outcome).toEqual({ average: 3, count: 1, vote: 3 })
    expect(loadListings()[0]).toMatchObject({ ratingTotal: 3, ratingCount: 1 })
  })

  it('repairs an orphan personal vote when loading listings', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ ratingTotal: 0, ratingCount: 0 })])
    )
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_rating: 4 }))

    expect(loadListings()[0]).toMatchObject({ ratingTotal: 4, ratingCount: 1 })
  })

  it('removes votes for listings that are no longer present and invalid votes', () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_rating: 4, removed: 5, bad: 'x' }))

    loadListings()

    expect(JSON.parse(localStorage.getItem(VOTES_KEY))).toEqual({ mkt_rating: 4 })
  })

  it('does not expose a success result when the aggregate write fails', () => {
    seedListing()
    const before = JSON.parse(localStorage.getItem(LISTINGS_KEY))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    expect(rateAgent('mkt_rating', 5)).toBeNull()
    expect(JSON.parse(localStorage.getItem(LISTINGS_KEY))).toEqual(before)
  })

  it('ignores a corrupt personal vote instead of treating it as a star value', () => {
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_rating: 'five' }))
    expect(getUserVote('mkt_rating')).toBeNull()
  })

  it('loads all valid votes in one read for list rendering', () => {
    localStorage.setItem(VOTES_KEY, JSON.stringify({ first: 4, second: '5', third: 0, fourth: 5 }))

    expect(loadUserVotes()).toEqual({ first: 4, fourth: 5 })
  })

  it('returns an empty vote map when storage is malformed or unavailable', () => {
    localStorage.setItem(VOTES_KEY, JSON.stringify(['not', 'a', 'map']))
    expect(loadUserVotes()).toEqual({})

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(loadUserVotes()).toEqual({})
  })
})
