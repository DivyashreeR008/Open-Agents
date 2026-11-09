import { afterEach, describe, expect, it } from 'vitest'
import { loadListings, normalizeListing } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'

describe('marketplace listing shape guards', () => {
  afterEach(() => localStorage.clear())

  it('rejects array records that cannot carry listing fields', () => {
    expect(normalizeListing([])).toBeNull()
    expect(normalizeListing(null)).toBeNull()

    localStorage.setItem(LISTINGS_KEY, JSON.stringify([[], { id: 'valid', name: 'Valid listing' }]))

    const listings = loadListings()
    expect(listings).toHaveLength(1)
    expect(listings[0].id).toBe('valid')
  })
})
