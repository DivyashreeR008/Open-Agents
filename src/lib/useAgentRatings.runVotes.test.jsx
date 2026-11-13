import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAgentRatings } from './useAgentRatings'

beforeEach(() => {
  localStorage.clear()
})

describe('useAgentRatings per-run votes', () => {
  it('counts separate runs separately and persists each selected vote', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('a1', 'up', 'run-1')
      result.current.rateAgent('a1', 'up', 'run-2')
    })

    expect(result.current.getAgentRatingInfo('a1')).toMatchObject({ up: 2, total: 2 })
    expect(result.current.getRunVote('run-1')).toBe('up')
    expect(result.current.getRunVote('run-2')).toBe('up')
  })

  it('does not duplicate or remove a repeated run vote', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('a1', 'up', 'run-1')
    })
    let outcome
    act(() => {
      outcome = result.current.rateAgent('a1', 'up', 'run-1')
    })

    expect(outcome?.unchanged).toBe(true)
    expect(result.current.getAgentRatingInfo('a1')).toMatchObject({ up: 1, total: 1 })
    expect(result.current.getRunVote('run-1')).toBe('up')
  })

  it('moves the point when the same run changes its rating', () => {
    const { result } = renderHook(() => useAgentRatings())

    act(() => {
      result.current.rateAgent('a1', 'up', 'run-1')
      result.current.rateAgent('a1', 'down', 'run-1')
    })

    expect(result.current.getAgentRatingInfo('a1')).toMatchObject({ up: 0, down: 1, total: 1 })
    expect(result.current.getRunVote('run-1')).toBe('down')
  })
})
