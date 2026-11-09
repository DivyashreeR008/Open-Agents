import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAgentRatings } from './useAgentRatings'

describe('agent rating blocked storage', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('does not expose a vote when the ratings write is rejected', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() => useAgentRatings())
    act(() => result.current.rateAgent('agent-1', 'up'))

    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 0,
      down: 0,
      total: 0,
      percentage: 0,
    })
    expect(result.current.getUserVote('agent-1')).toBeNull()
  })
})
