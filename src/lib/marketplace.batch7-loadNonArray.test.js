import { beforeEach, describe, expect, it } from 'vitest'
import { loadListings } from './marketplace'

beforeEach(() => localStorage.clear())

describe('loadListings non-array storage', () => {
  it('returns an empty marketplace when the stored value is an object', () => {
    localStorage.setItem('oa_marketplace_listings', JSON.stringify({ id: 'l1' }))

    expect(loadListings()).toEqual([])
  })
})
