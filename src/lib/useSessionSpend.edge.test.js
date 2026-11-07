import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionSpend } from './useSessionSpend'
import {
  fireStorageEvent,
  simulateQuotaExceeded,
  simulateStorageDisabled,
} from '../test/storageFailures'

const STORAGE_KEY = 'oa_session_spend'

const storedRun = (id, overrides = {}) => ({
  id,
  model: 'gpt-4o',
  inputTokens: 1000,
  outputTokens: 500,
  inputCost: 0.1,
  outputCost: 0.2,
  totalCost: 0.3,
  timestamp: 1,
  ...overrides,
})

describe('useSessionSpend edge behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('keeps the completed run in memory when the quota blocks the write', () => {
    const { result } = renderHook(() => useSessionSpend())
    simulateQuotaExceeded()

    act(() => {
      result.current.addRun({
        model: 'gpt-4o',
        inputCost: 0.4,
        outputCost: 0.1,
      })
    })

    expect(result.current.runs).toHaveLength(1)
    expect(result.current.runs[0].totalCost).toBeCloseTo(0.5, 10)
    expect(result.current.totalSpend).toBeCloseTo(0.5, 10)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('clears the in-memory session when storage is unavailable', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runs: [storedRun('a')], totalSpend: 0.3 }))
    const { result } = renderHook(() => useSessionSpend())
    expect(result.current.runs).toHaveLength(1)

    simulateStorageDisabled()

    expect(() => act(() => result.current.clearSession())).not.toThrow()
    expect(result.current.runs).toEqual([])
    expect(result.current.totalSpend).toBe(0)
  })

  it('ignores storage events for unrelated keys', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ runs: [storedRun('stable')], totalSpend: 0.3 })
    )
    const { result } = renderHook(() => useSessionSpend())

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ runs: [storedRun('replacement')], totalSpend: 0.9 })
    )
    act(() => fireStorageEvent('some_other_key', null))

    expect(result.current.runs.map((run) => run.id)).toEqual(['stable'])
    expect(result.current.totalSpend).toBeCloseTo(0.3, 10)
  })
})
