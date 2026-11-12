import { describe, expect, it } from 'vitest'
import { normalizeListing } from './marketplace'

describe('normalizeListing numeric strings', () => {
  it('does not accept a string rating total as a valid aggregate', () => {
    const listing = normalizeListing({
      id: 'l1',
      name: 'Agent',
      ratingCount: 2,
      ratingTotal: '8',
    })

    expect(listing.ratingCount).toBe(0)
    expect(listing.ratingTotal).toBe(0)
  })
})
