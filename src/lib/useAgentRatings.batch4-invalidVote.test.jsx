import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useAgentRatings } from './useAgentRatings'

describe('agent rating invalid vote guards', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('ignores empty ids and unsupported vote values', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => result.current.rateAgent('', 'up'))
    act(() => result.current.rateAgent('agent-1', 'sideways'))

    expect(result.current.ratings).toEqual({})
    expect(result.current.getUserVote('agent-1')).toBeNull()
  })
})
