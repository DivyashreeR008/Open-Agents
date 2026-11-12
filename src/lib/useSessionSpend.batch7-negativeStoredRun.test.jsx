import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSessionSpend } from './useSessionSpend'

beforeEach(() => localStorage.clear())

describe('useSessionSpend stored run normalization', () => {
  it('clamps negative components and recomputes the total from valid parts', () => {
    localStorage.setItem(
      'oa_session_spend',
      JSON.stringify({
        runs: [
          { inputTokens: -5, outputTokens: '10', inputCost: -1, outputCost: 0, totalCost: 2 },
          null,
          { inputCost: 0.1, outputCost: 0.2, totalCost: 99 },
        ],
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(2)
    expect(result.current.runs[0].totalCost).toBe(2)
    expect(result.current.runs[1].totalCost).toBeCloseTo(0.3, 5)
    expect(result.current.totalSpend).toBeCloseTo(2.3, 5)
  })
})
