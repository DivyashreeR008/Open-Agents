import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { publishAgent, rateAgent } from './marketplace'

describe('marketplace repeat same vote', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('does not add the same vote twice', () => {
    const listing = publishAgent({
      name: 'Repeat vote',
      description: '',
      tags: [],
      category: 'Research',
      config: {},
    })

    expect(rateAgent(listing.id, 4)).toMatchObject({ average: 4, count: 1, vote: 4 })
    expect(rateAgent(listing.id, 4)).toMatchObject({ average: 4, count: 1, vote: 4 })
  })
})
