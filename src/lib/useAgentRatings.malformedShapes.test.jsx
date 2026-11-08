import { afterEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAgentRatings } from './useAgentRatings'

const STORAGE_KEY = 'oa_ratings'
const VOTES_KEY = 'oa_rating_votes'

afterEach(() => {
  localStorage.clear()
})

describe('useAgentRatings malformed storage shapes', () => {
  it('replaces a non-object ratings payload and vote ledger before voting', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('not-an-object'))
    localStorage.setItem(VOTES_KEY, JSON.stringify('not-an-object'))

    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('agent-1', 'up')
    })

    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 1,
      down: 0,
      total: 1,
      percentage: 100,
    })
    expect(result.current.getUserVote('agent-1')).toBe('up')
  })

  it('treats non-numeric counts and unsupported votes as empty', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'agent-1': { up: 'many', down: -4 } }))
    localStorage.setItem(VOTES_KEY, JSON.stringify({ 'agent-1': 'sideways' }))

    const { result } = renderHook(() => useAgentRatings())

    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 0,
      down: 0,
      total: 0,
      percentage: 0,
    })
    expect(result.current.getUserVote('agent-1')).toBeNull()
  })
})
