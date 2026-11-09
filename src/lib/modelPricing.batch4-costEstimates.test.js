import { describe, expect, it } from 'vitest'
import { estimateInputCost, estimateOutputCost } from './modelPricing'

describe('model cost estimates', () => {
  it('returns null when the model is not priced', () => {
    expect(estimateInputCost('missing', 1000)).toBeNull()
    expect(estimateOutputCost('missing', 1000)).toBeNull()
  })

  it('scales per-million prices by the token count', () => {
    expect(estimateInputCost('gpt-4o-mini', 1_000_000)).toBeCloseTo(0.15)
    expect(estimateOutputCost('gpt-4o-mini', 500_000)).toBeCloseTo(0.3)
  })
})
