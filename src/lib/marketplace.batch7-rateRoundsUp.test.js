import { beforeEach, describe, expect, it } from 'vitest'
import { rateAgent } from './marketplace'

beforeEach(() => localStorage.clear())

function seedListing() {
  localStorage.setItem(
    'oa_marketplace_listings',
    JSON.stringify([{ id: 'l1', name: 'Agent', ratingCount: 0, ratingTotal: 0 }])
  )
}

describe('rateAgent vote rounding', () => {
  it('rounds 4.6 up to five stars', () => {
    seedListing()
    const result = rateAgent('l1', 4.6)

    expect(result).toEqual({ average: 5, count: 1, vote: 5 })
  })
})
