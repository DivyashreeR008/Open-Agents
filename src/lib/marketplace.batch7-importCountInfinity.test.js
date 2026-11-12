import { describe, expect, it } from 'vitest'
import { normalizeListing } from './marketplace'

describe('normalizeListing non-finite metadata', () => {
  it('resets an infinite import count and a numeric publish date', () => {
    const listing = normalizeListing({
      id: 'l1',
      name: 'Agent',
      importCount: Infinity,
      publishedAt: 12345,
    })

    expect(listing.importCount).toBe(0)
    expect(listing.publishedAt).toBe('')
  })
})
