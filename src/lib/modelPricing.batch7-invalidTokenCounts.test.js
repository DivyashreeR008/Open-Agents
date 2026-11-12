import { describe, expect, it } from 'vitest'
import { estimateInputCost, estimateOutputCost } from './modelPricing'

describe('token cost estimates with invalid counts', () => {
  it('does not return a negative charge for a negative token count', () => {
    expect(estimateInputCost('gpt-4o', -1_000_000)).toBeNull()
    expect(estimateOutputCost('gpt-4o', -1)).toBeNull()
  })

  it('does not return NaN or Infinity for a non-finite count', () => {
    expect(estimateInputCost('gpt-4o', Number.NaN)).toBeNull()
    expect(estimateOutputCost('gpt-4o', Number.POSITIVE_INFINITY)).toBeNull()
  })

  it('rejects non-number token counts instead of coercing strings', () => {
    expect(estimateInputCost('gpt-4o', '1000')).toBeNull()
    expect(estimateOutputCost('gpt-4o', null)).toBeNull()
  })
})
