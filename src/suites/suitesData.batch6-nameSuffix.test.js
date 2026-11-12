import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite display names', () => {
  it('ends every suite name with the Suite label', () => {
    for (const suite of suites) {
      expect(suite.name, suite.id).toMatch(/Suite$/)
    }
  })
})
