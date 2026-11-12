import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAgentRatings } from './useAgentRatings'

beforeEach(() => localStorage.clear())

describe('useAgentRatings stored count sanitization', () => {
  it('floors positive counts and drops negative, string, and empty ids', () => {
    localStorage.setItem(
      'oa_ratings',
      JSON.stringify({
        a1: { up: 2.9, down: -1 },
        a2: { up: '3', down: 1 },
        '': { up: 1 },
        a3: null,
      })
    )

    const { result } = renderHook(() => useAgentRatings())

    expect(result.current.ratings).toEqual({
      a1: { up: 2, down: 0 },
      a2: { up: 0, down: 1 },
    })
  })
})
