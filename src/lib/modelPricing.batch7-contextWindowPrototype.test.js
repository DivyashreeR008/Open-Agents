import { describe, expect, it } from 'vitest'
import { getContextWindow } from './modelPricing'

describe('getContextWindow prototype safety', () => {
  it('does not read an inherited constructor name as a model', () => {
    expect(getContextWindow('constructor')).toBe(128000)
  })

  it('does not coerce a numeric model id into a key', () => {
    expect(getContextWindow(123)).toBe(128000)
  })
})
