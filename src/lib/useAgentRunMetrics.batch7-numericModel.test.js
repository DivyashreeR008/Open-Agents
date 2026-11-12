import { describe, expect, it } from 'vitest'
import { estimateCost } from './useAgentRunMetrics'

describe('estimateCost model type guards', () => {
  it('returns null for a numeric model id', () => {
    expect(estimateCost(123, 1000, 1000)).toBeNull()
  })

  it('returns zero for a known model with no tokens', () => {
    expect(estimateCost('gpt-4o', 0, 0)).toBe(0)
  })
})
