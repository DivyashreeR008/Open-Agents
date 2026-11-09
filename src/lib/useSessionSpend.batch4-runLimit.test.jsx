import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSessionSpend } from './useSessionSpend'

const STORAGE_KEY = 'oa_session_spend'

const storedRun = (id, timestamp) => ({
  id,
  model: 'gpt-4o',
  inputTokens: 1,
  outputTokens: 1,
  inputCost: 0.01,
  outputCost: 0.02,
  totalCost: 0.03,
  timestamp,
})

describe('session spend history limit', () => {
  beforeEach(() => localStorage.clear())

  it('keeps two hundred runs after adding a new one and drops the oldest', () => {
    const runs = Array.from({ length: 200 }, (_, index) => storedRun(`run-${index}`, index))
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runs, totalSpend: 6 }))

    const { result } = renderHook(() => useSessionSpend())
    expect(result.current.runs).toHaveLength(200)

    act(() => {
      result.current.addRun({
        model: 'gpt-4o',
        inputTokens: 10,
        outputTokens: 5,
        inputCost: 0.1,
        outputCost: 0.2,
      })
    })

    expect(result.current.runs).toHaveLength(200)
    expect(result.current.runs[0].inputTokens).toBe(10)
    expect(result.current.runs.some((run) => run.id === 'run-199')).toBe(false)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).runs).toHaveLength(200)
  })
})
