import { describe, expect, it } from 'vitest'
import { tokenEstimate } from './useTokenCounter'

describe('token estimation for non-string input', () => {
  it('returns zero instead of throwing for numbers, objects, and booleans', () => {
    expect(tokenEstimate(42)).toBe(0)
    expect(tokenEstimate({ text: 'hello' })).toBe(0)
    expect(tokenEstimate(false)).toBe(0)
  })
})
