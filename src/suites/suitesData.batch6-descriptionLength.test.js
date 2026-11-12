import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite description length', () => {
  it('keeps every suite description between twenty and two hundred characters', () => {
    for (const suite of suites) {
      expect(suite.description.length, suite.id).toBeGreaterThanOrEqual(20)
      expect(suite.description.length, suite.id).toBeLessThanOrEqual(200)
    }
  })
})
