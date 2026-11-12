import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAgentRatings } from './useAgentRatings'

const RATINGS_KEY = 'oa_ratings'
const VOTES_KEY = 'oa_rating_votes'

beforeEach(() => {
  localStorage.clear()
})

describe('useAgentRatings stored hydration', () => {
  it('loads saved totals and the current vote on first render', () => {
    localStorage.setItem(RATINGS_KEY, JSON.stringify({ 'agent-1': { up: 3, down: 1 } }))
    localStorage.setItem(VOTES_KEY, JSON.stringify({ 'agent-1': 'up' }))

    const { result } = renderHook(() => useAgentRatings())

    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 3,
      down: 1,
      total: 4,
      percentage: 75,
    })
    expect(result.current.getUserVote('agent-1')).toBe('up')
  })
})
