import { beforeEach, describe, expect, it } from 'vitest'
import { getUserVote, loadUserVotes } from './marketplace'

beforeEach(() => localStorage.clear())

describe('loadUserVotes filtering', () => {
  it('keeps only whole-star votes and returns null for an invalid vote', () => {
    localStorage.setItem(
      'oa_marketplace_votes',
      JSON.stringify({ a: 5, b: 6, c: '5', d: null, e: 0 })
    )

    expect(loadUserVotes()).toEqual({ a: 5 })
    expect(getUserVote('b')).toBeNull()
  })
})
