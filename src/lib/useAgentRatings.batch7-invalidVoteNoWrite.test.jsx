import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAgentRatings } from './useAgentRatings'

const STORAGE_KEY = 'oa_ratings'
const VOTES_KEY = 'oa_rating_votes'

describe('useAgentRatings invalid vote no write', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('does not write ratings or votes to storage for unrecognized vote values', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('agent-1', 'invalid')
      result.current.rateAgent('agent-1', 'sideways')
      result.current.rateAgent('agent-1', 'unknown')
      result.current.rateAgent('agent-1', null)
      result.current.rateAgent('agent-1', undefined)
    })

    expect(setItemSpy).not.toHaveBeenCalled()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem(VOTES_KEY)).toBeNull()
    expect(result.current.ratings).toEqual({})
    expect(result.current.getUserVote('agent-1')).toBeNull()
    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 0,
      down: 0,
      total: 0,
      percentage: 0,
    })
  })

  it('preserves existing ratings and votes without writing when an unrecognized vote is submitted', () => {
    const existingRatings = { 'agent-1': { up: 5, down: 2 } }
    const existingVotes = { 'agent-1': 'up' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingRatings))
    localStorage.setItem(VOTES_KEY, JSON.stringify(existingVotes))

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('agent-1', 'maybe')
    })

    expect(setItemSpy).not.toHaveBeenCalled()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(existingRatings)
    expect(JSON.parse(localStorage.getItem(VOTES_KEY))).toEqual(existingVotes)
    expect(result.current.getUserVote('agent-1')).toBe('up')
    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 5,
      down: 2,
      total: 7,
      percentage: 71,
    })
  })
})
