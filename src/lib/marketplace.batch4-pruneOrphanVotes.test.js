import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadListings, loadUserVotes } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'
const VOTES_KEY = 'oa_marketplace_votes'

describe('marketplace vote reconciliation cleanup', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('removes votes for missing listings and invalid vote values', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([{ id: 'mkt_1', name: 'One', tags: [], config: {} }])
    )
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_1: 4, gone: 5, bad: 9, text: 'x' }))

    loadListings()

    expect(loadUserVotes()).toEqual({ mkt_1: 4 })
    expect(JSON.parse(localStorage.getItem(VOTES_KEY))).toEqual({ mkt_1: 4 })
  })
})
