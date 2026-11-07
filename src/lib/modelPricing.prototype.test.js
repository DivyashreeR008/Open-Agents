import { describe, expect, it } from 'vitest'
import { estimateInputCost, estimateOutputCost, getContextWindow, getPricing } from './modelPricing'

describe('model pricing lookup boundaries', () => {
  it('does not return inherited object keys as pricing rows', () => {
    for (const modelId of ['toString', 'constructor', 'hasOwnProperty', '__proto__']) {
      expect(getPricing(modelId), modelId).toBeNull()
      expect(estimateInputCost(modelId, 1000), modelId).toBeNull()
      expect(estimateOutputCost(modelId, 1000), modelId).toBeNull()
      expect(getContextWindow(modelId), modelId).toBe(128000)
    }
  })

  it('still prices a real model correctly', () => {
    expect(getPricing('gpt-4o')).not.toBeNull()
    expect(estimateInputCost('gpt-4o', 1_000_000)).toBeCloseTo(2.5)
  })
})
