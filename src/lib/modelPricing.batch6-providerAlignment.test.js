import { describe, expect, it } from 'vitest'
import { MODEL_PRICING } from './modelPricing'

describe('pricing provider alignment', () => {
  it('uses only supported providers and keeps OpenRouter keys namespaced', () => {
    const providers = new Set(['openai', 'anthropic', 'gemini', 'openrouter'])
    for (const [model, pricing] of Object.entries(MODEL_PRICING)) {
      expect(providers.has(pricing.provider), model).toBe(true)
      if (pricing.provider === 'openrouter') expect(model, model).toContain('/')
      else expect(model, model).not.toContain('/')
    }
  })
})
