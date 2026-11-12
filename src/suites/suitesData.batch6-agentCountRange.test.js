import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite agent count', () => {
  it('keeps every suite between four and twenty-five agents', () => {
    for (const suite of suites) {
      expect(suite.agents.length, suite.id).toBeGreaterThanOrEqual(4)
      expect(suite.agents.length, suite.id).toBeLessThanOrEqual(25)
    }
  })
})
