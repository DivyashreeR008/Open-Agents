import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useSessionSpend } from './useSessionSpend'

describe('session spend unknown model fallback', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('records zero cost when pricing is unavailable for the model', () => {
    const { result } = renderHook(() => useSessionSpend())

    act(() => {
      result.current.addRun({ model: 'unknown-model', inputTokens: 1200, outputTokens: 800 })
    })

    expect(result.current.runs[0]).toMatchObject({
      model: 'unknown-model',
      inputTokens: 1200,
      outputTokens: 800,
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
    })
    expect(result.current.totalSpend).toBe(0)
  })
})
