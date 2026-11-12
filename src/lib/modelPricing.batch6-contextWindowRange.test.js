import { describe, expect, it } from 'vitest'
import { MODEL_PRICING } from './modelPricing'

describe('pricing context windows', () => {
  it('keeps every context window between 100k and 2M tokens', () => {
    for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
      expect(pricing.contextWindow, model).toBeGreaterThanOrEqual(100000)
      expect(pricing.contextWindow, model).toBeLessThanOrEqual(2000000)
    }
  })
})
