import { beforeEach, describe, expect, it } from 'vitest'
import { loadListings } from './marketplace'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('oa_marketplace_votes', 'null')
})

describe('marketplace null vote store', () => {
  it('loads listings when the vote map is null', () => {
    expect(loadListings()).toEqual([])
  })
})
