import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSessionSpend } from './useSessionSpend'

beforeEach(() => localStorage.clear())

describe('useSessionSpend stored run cap', () => {
  it('keeps at most two hundred runs and sums only the kept records', () => {
    const runs = Array.from({ length: 205 }, () => ({ totalCost: 1 }))
    localStorage.setItem('oa_session_spend', JSON.stringify({ runs }))

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(200)
    expect(result.current.totalSpend).toBe(200)
  })
})
