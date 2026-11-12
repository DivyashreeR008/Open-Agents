import { describe, expect, it } from 'vitest'
import { normalizeListing } from './marketplace'

describe('normalizeListing unreachable rating totals', () => {
  it('resets a total above five stars per vote', () => {
    const listing = normalizeListing({
      id: 'l1',
      name: 'Agent',
      ratingCount: 2,
      ratingTotal: 11,
    })

    expect(listing.ratingCount).toBe(0)
    expect(listing.ratingTotal).toBe(0)
  })
})
