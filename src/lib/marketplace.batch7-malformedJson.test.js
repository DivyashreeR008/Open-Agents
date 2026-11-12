import { beforeEach, describe, expect, it } from 'vitest'
import { loadListings } from './marketplace'

beforeEach(() => localStorage.clear())

describe('loadListings malformed JSON', () => {
  it('returns an empty list instead of throwing', () => {
    localStorage.setItem('oa_marketplace_listings', '{not-json')

    expect(loadListings()).toEqual([])
  })
})
