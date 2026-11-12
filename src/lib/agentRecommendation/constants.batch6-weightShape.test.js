import { describe, expect, it } from 'vitest'
import { DEFAULT_RECOMMENDATION_WEIGHTS } from './constants'

describe('recommendation weights', () => {
  it('gives every scoring signal a positive finite weight', () => {
    for (const [name, weight] of Object.entries(DEFAULT_RECOMMENDATION_WEIGHTS)) {
      expect(Number.isFinite(weight), name).toBe(true)
      expect(weight, name).toBeGreaterThan(0)
    }
  })
})
