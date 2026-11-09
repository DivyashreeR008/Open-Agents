import { describe, expect, it } from 'vitest'
import { getContextWindow, getPricing } from './modelPricing'

describe('model pricing lookup guards', () => {
  it('returns null for unknown and non-string model ids', () => {
    expect(getPricing('missing')).toBeNull()
    expect(getPricing(null)).toBeNull()
    expect(getPricing({})).toBeNull()
  })

  it('falls back to the default context window for unknown models', () => {
    expect(getContextWindow('missing')).toBe(128000)
    expect(getContextWindow('gemini-1.5-pro')).toBe(2000000)
  })
})
