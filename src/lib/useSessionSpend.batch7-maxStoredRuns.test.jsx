import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionSpend } from './useSessionSpend'

const STORAGE_KEY = 'oa_session_spend'

const createRun = (id, totalCost = 1.0) => ({
  id,
  model: 'test-model',
  inputTokens: 100,
  outputTokens: 50,
  inputCost: totalCost / 2,
  outputCost: totalCost / 2,
  totalCost,
  timestamp: Date.now(),
})

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useSessionSpend max stored runs', () => {
  it('keeps at most two hundred runs and sums only the kept records on load', () => {
    // Generate 250 runs, each with totalCost = 1.0
    const runs = Array.from({ length: 250 }, (_, i) => createRun(`run-${i}`, 1.0))

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        runs,
        totalSpend: 250,
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(200)
    expect(result.current.runs[0].id).toBe('run-0')
    expect(result.current.runs[199].id).toBe('run-199')
    expect(result.current.totalSpend).toBe(200)
  })

  it('keeps exactly two hundred runs when input is exactly 200', () => {
    const runs = Array.from({ length: 200 }, (_, i) => createRun(`run-${i}`, 2.0))

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        runs,
        totalSpend: 400,
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(200)
    expect(result.current.totalSpend).toBe(400)
  })
})
