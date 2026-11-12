import { describe, expect, it } from 'vitest'
import { getPricing } from './modelPricing'

describe('getPricing symbol model ids', () => {
  it('returns null instead of coercing a symbol to a key', () => {
    expect(getPricing(Symbol('gpt-4o'))).toBeNull()
  })
})
