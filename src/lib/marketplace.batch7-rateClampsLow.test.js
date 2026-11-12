import { beforeEach, describe, expect, it } from 'vitest'
import { rateAgent } from './marketplace'

beforeEach(() => localStorage.clear())

describe('rateAgent vote clamping', () => {
  it('clamps a negative rating to one star', () => {
    localStorage.setItem(
      'oa_marketplace_listings',
      JSON.stringify([{ id: 'l1', name: 'Agent', ratingCount: 0, ratingTotal: 0 }])
    )

    expect(rateAgent('l1', -2)).toEqual({ average: 1, count: 1, vote: 1 })
  })
})
