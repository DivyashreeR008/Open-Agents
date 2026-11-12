import { describe, expect, it } from 'vitest'
import { MODEL_PRICING } from './modelPricing'

describe('pricing table shape', () => {
  it('gives every entry a provider, positive rates, and a positive context window', () => {
    for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
      expect(typeof pricing.provider, model).toBe('string')
      expect(pricing.provider.trim().length, model).toBeGreaterThan(0)
      expect(pricing.inputCostPer1M, model).toBeGreaterThan(0)
      expect(pricing.outputCostPer1M, model).toBeGreaterThan(0)
      expect(pricing.contextWindow, model).toBeGreaterThan(0)
    }
  })
})
