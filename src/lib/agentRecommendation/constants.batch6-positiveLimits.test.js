import { describe, expect, it } from 'vitest'
import { RESULT_LIMIT, MIN_CONFIDENT_SCORE } from './constants'

describe('recommendation limits', () => {
  it('uses positive integer limits and thresholds', () => {
    for (const value of [RESULT_LIMIT, MIN_CONFIDENT_SCORE]) {
      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThan(0)
    }
  })
})
