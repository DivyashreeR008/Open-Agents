import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAgentRatings } from './useAgentRatings'

const RATINGS_KEY = 'oa_ratings'
const VOTES_KEY = 'oa_rating_votes'

describe('useAgentRatings malformed storage and write failures', () => {
  let errorSpy

  beforeEach(() => {
    localStorage.clear()
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('starts clean when stored ratings and votes contain invalid JSON', () => {
    localStorage.setItem(RATINGS_KEY, '{"a1":')
    localStorage.setItem(VOTES_KEY, 'not-json')

    const { result } = renderHook(() => useAgentRatings())

    expect(result.current.getAgentRatingInfo('a1')).toEqual({
      up: 0,
      down: 0,
      total: 0,
      percentage: 0,
    })
    expect(result.current.getUserVote('a1')).toBeNull()
    expect(errorSpy).toHaveBeenCalledWith(
      'Error parsing ratings from localStorage:',
      expect.any(SyntaxError)
    )

    act(() => {
      result.current.rateAgent('a1', 'down')
    })

    expect(result.current.getAgentRatingInfo('a1')).toEqual({
      up: 0,
      down: 1,
      total: 1,
      percentage: 0,
    })
    expect(result.current.getUserVote('a1')).toBe('down')
  })

  it('ignores empty ids and unsupported vote values', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('', 'up')
      result.current.rateAgent('a1', 'sideways')
    })

    expect(result.current.getUserVote('a1')).toBeNull()
    expect(result.current.getAgentRatingInfo('a1')).toEqual({
      up: 0,
      down: 0,
      total: 0,
      percentage: 0,
    })
  })

  it('keeps the accepted rating when saving the rating totals fails', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('a1', 'up')
    })

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    act(() => {
      result.current.rateAgent('a1', 'down')
    })

    expect(errorSpy).toHaveBeenCalledWith(
      'Error saving ratings to localStorage:',
      expect.any(Error)
    )
    expect(result.current.getAgentRatingInfo('a1')).toMatchObject({
      up: 1,
      down: 0,
      total: 1,
    })
    expect(result.current.getUserVote('a1')).toBe('up')
  })

  it('still persists totals when saving the vote ledger fails', () => {
    const originalSetItem = Storage.prototype.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function setItem(key, value) {
      if (key === VOTES_KEY) throw new Error('votes blocked')
      return originalSetItem.call(this, key, value)
    })

    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('a1', 'up')
    })

    expect(errorSpy).toHaveBeenCalledWith(
      'Error saving rating votes to localStorage:',
      expect.any(Error)
    )
    expect(JSON.parse(localStorage.getItem(RATINGS_KEY))).toEqual({
      a1: { up: 1, down: 0 },
    })
    expect(result.current.getAgentRatingInfo('a1')).toMatchObject({
      up: 1,
      down: 0,
      total: 1,
    })
    expect(result.current.getUserVote('a1')).toBeNull()
  })
})
