import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionSpend } from './useSessionSpend'

const STORAGE_KEY = 'oa_session_spend'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useSessionSpend negative stored run', () => {
  it('clamps negative components and recomputes the total from valid parts', () => {
    const corruptRun = {
      model: 'test-model',
      inputTokens: -100,
      outputTokens: 200,
      inputCost: -0.5,
      outputCost: 0.75,
      totalCost: -99,
      timestamp: 1000,
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        runs: [corruptRun],
        totalSpend: -99,
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(1)
    expect(result.current.runs[0]).toMatchObject({
      model: 'test-model',
      inputTokens: 0,
      outputTokens: 200,
      inputCost: 0,
      outputCost: 0.75,
      totalCost: 0.75,
      timestamp: 1000,
    })
    expect(result.current.totalSpend).toBeCloseTo(0.75, 10)
  })

  it('handles negative totalCost when component costs are zero', () => {
    const corruptRun = {
      model: 'test-model',
      inputTokens: -10,
      outputTokens: -20,
      inputCost: -0.1,
      outputCost: -0.2,
      totalCost: -5.0,
      timestamp: 2000,
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        runs: [corruptRun],
        totalSpend: -5.0,
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(1)
    expect(result.current.runs[0]).toMatchObject({
      model: 'test-model',
      inputTokens: 0,
      outputTokens: 0,
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
      timestamp: 2000,
    })
    expect(result.current.totalSpend).toBe(0)
  })
})
