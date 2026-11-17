import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTokenCounter } from './useTokenCounter'

describe('token counter blank input', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('settles on zero tokens immediately for whitespace-only text', () => {
    const { result } = renderHook(() => useTokenCounter('   \n\t ', 50))

    expect(result.current.tokens).toBe(0)
    expect(result.current.isEstimating).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })
})
