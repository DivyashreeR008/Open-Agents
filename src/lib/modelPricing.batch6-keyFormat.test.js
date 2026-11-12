import { describe, expect, it } from 'vitest'
import { MODEL_PRICING } from './modelPricing'

describe('pricing model keys', () => {
  it('uses trimmed, lowercase model identifiers', () => {
    for (const model of Object.keys(MODEL_PRICING)) {
      expect(model.length, model).toBeGreaterThan(0)
      expect(model, model).toBe(model.trim())
      expect(model, model).toBe(model.toLowerCase())
    }
  })
})
