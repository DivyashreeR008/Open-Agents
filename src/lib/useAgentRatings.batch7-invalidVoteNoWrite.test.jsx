import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAgentRatings } from './useAgentRatings'

beforeEach(() => localStorage.clear())

describe('useAgentRatings invalid votes', () => {
  it('does not write ratings for an unrecognized vote value', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => result.current.rateAgent('a1', 'sideways'))

    expect(localStorage.getItem('oa_ratings')).toBeNull()
    expect(result.current.getUserVote('a1')).toBeNull()
  })
})
