import { describe, expect, it } from 'vitest'
import { MODEL_PRICING } from './modelPricing'

describe('pricing rate ordering', () => {
  it('never charges less for output tokens than for input tokens', () => {
    for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
      expect(pricing.outputCostPer1M, model).toBeGreaterThanOrEqual(pricing.inputCostPer1M)
    }
  })
})
