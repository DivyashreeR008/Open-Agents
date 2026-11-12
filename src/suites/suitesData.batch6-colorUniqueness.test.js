import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite color uniqueness', () => {
  it('does not give two suites the same accent color', () => {
    const seen = new Map()
    for (const suite of suites) {
      expect(seen.has(suite.color), suite.id + ' duplicates ' + seen.get(suite.color)).toBe(false)
      seen.set(suite.color, suite.id)
    }
  })
})
