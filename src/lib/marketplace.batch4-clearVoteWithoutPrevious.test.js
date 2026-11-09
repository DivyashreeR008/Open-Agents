import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { publishAgent, rateAgent } from './marketplace'

const VOTES_KEY = 'oa_marketplace_votes'

describe('marketplace clear vote without a previous vote', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('returns the current aggregate and does not create a vote record', () => {
    const listing = publishAgent({
      name: 'Unvoted',
      description: '',
      tags: [],
      category: 'Research',
      config: {},
    })

    expect(rateAgent(listing.id, null)).toEqual({ average: 0, count: 0, vote: null })
    expect(localStorage.getItem(VOTES_KEY)).toBeNull()
  })
})
