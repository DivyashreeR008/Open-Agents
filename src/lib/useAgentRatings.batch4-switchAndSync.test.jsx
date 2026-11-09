import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAgentRatings } from './useAgentRatings'

const RATINGS_KEY = 'oa_ratings'
const VOTES_KEY = 'oa_rating_votes'

describe('rating changes and cross-tab sync', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('moves a vote from up to down without double counting', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => result.current.rateAgent('agent-1', 'up'))
    act(() => result.current.rateAgent('agent-1', 'down'))

    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 0,
      down: 1,
      total: 1,
      percentage: 0,
    })
    expect(result.current.getUserVote('agent-1')).toBe('down')
    expect(JSON.parse(localStorage.getItem(VOTES_KEY))).toEqual({ 'agent-1': 'down' })
  })

  it('reloads totals when another tab writes rating storage', () => {
    const { result } = renderHook(() => useAgentRatings())

    localStorage.setItem(RATINGS_KEY, JSON.stringify({ 'agent-2': { up: 4, down: 1 } }))
    localStorage.setItem(VOTES_KEY, JSON.stringify({ 'agent-2': 'up' }))
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: RATINGS_KEY })))

    expect(result.current.getAgentRatingInfo('agent-2')).toEqual({
      up: 4,
      down: 1,
      total: 5,
      percentage: 80,
    })
    expect(result.current.getUserVote('agent-2')).toBe('up')
  })
})
