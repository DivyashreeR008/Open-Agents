import { describe, expect, it } from 'vitest'
import {
  MODEL_PRICING,
  estimateInputCost,
  estimateOutputCost,
  getContextWindow,
  getPricing,
} from './modelPricing'

describe('model pricing lookup', () => {
  it('returns the published rates for a known model', () => {
    expect(getPricing('gpt-4o')).toEqual({
      provider: 'openai',
      inputCostPer1M: 2.5,
      outputCostPer1M: 10,
      contextWindow: 128000,
    })
  })

  it('returns null for an unknown or missing model id', () => {
    expect(getPricing('does-not-exist')).toBeNull()
    expect(getPricing(undefined)).toBeNull()
  })

  it('keeps every pricing entry complete and usable', () => {
    for (const [modelId, pricing] of Object.entries(MODEL_PRICING)) {
      expect(modelId).not.toBe('')
      expect(pricing.provider).toMatch(/^(openai|anthropic|gemini|openrouter)$/)
      expect(pricing.inputCostPer1M).toBeGreaterThan(0)
      expect(pricing.outputCostPer1M).toBeGreaterThan(0)
      expect(pricing.contextWindow).toBeGreaterThan(0)
    }
  })
})

describe('token cost estimates', () => {
  it('prices input tokens at the per-million rate', () => {
    expect(estimateInputCost('gpt-4o', 1_000_000)).toBeCloseTo(2.5, 10)
    expect(estimateInputCost('gpt-4o', 500_000)).toBeCloseTo(1.25, 10)
    expect(estimateInputCost('gpt-4o-mini', 250_000)).toBeCloseTo(0.0375, 10)
    expect(estimateInputCost('claude-3-5-sonnet-20241022', 2_000_000)).toBeCloseTo(6, 10)
  })

  it('prices output tokens at their own per-million rate', () => {
    expect(estimateOutputCost('gpt-4o', 1_000_000)).toBeCloseTo(10, 10)
    expect(estimateOutputCost('gpt-4o', 250_000)).toBeCloseTo(2.5, 10)
    expect(estimateOutputCost('gemini-2.0-flash-exp', 1_000_000)).toBeCloseTo(0.4, 10)
    expect(estimateOutputCost('claude-3-opus-20240229', 1_000_000)).toBeCloseTo(75, 10)
  })

  it('returns zero for zero tokens and keeps fractional token counts proportional', () => {
    expect(estimateInputCost('gpt-4o', 0)).toBe(0)
    expect(estimateOutputCost('gpt-4o', 0)).toBe(0)
    expect(estimateInputCost('gpt-4o', 1)).toBeCloseTo(0.0000025, 12)
    expect(estimateOutputCost('gpt-4o-mini', 1)).toBeCloseTo(0.0000006, 12)
  })

  it('returns null rather than zero when the model has no pricing entry', () => {
    expect(estimateInputCost('unknown-model', 1_000_000)).toBeNull()
    expect(estimateOutputCost('unknown-model', 1_000_000)).toBeNull()
  })
})

describe('context window lookup', () => {
  it('returns the model-specific window', () => {
    expect(getContextWindow('gpt-4o')).toBe(128000)
    expect(getContextWindow('o3-mini')).toBe(200000)
    expect(getContextWindow('gemini-1.5-pro')).toBe(2000000)
    expect(getContextWindow('google/gemini-2.5-flash')).toBe(1000000)
  })

  it('falls back to 128k for an unknown model', () => {
    expect(getContextWindow('unknown-model')).toBe(128000)
  })
})
