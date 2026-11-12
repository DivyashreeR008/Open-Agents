import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite icon names', () => {
  it('stores a non-empty, trimmed icon name for every suite', () => {
    for (const suite of suites) {
      expect(typeof suite.icon, suite.id).toBe('string')
      expect(suite.icon.length, suite.id).toBeGreaterThan(0)
      expect(suite.icon, suite.id).toBe(suite.icon.trim())
    }
  })
})
