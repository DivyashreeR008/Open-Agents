import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAgentRatings } from './useAgentRatings'

describe('rating storage failures', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('does not throw or record a vote when rating storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage is blocked')
    })

    const { result } = renderHook(() => useAgentRatings())

    expect(() => {
      act(() => result.current.rateAgent('agent-1', 'up'))
    }).not.toThrow()

    expect(result.current.getAgentRatingInfo('agent-1')).toEqual({
      up: 0,
      down: 0,
      total: 0,
      percentage: 0,
    })
    expect(result.current.getUserVote('agent-1')).toBeNull()
  })
})
