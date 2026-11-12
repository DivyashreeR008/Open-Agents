import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite color format', () => {
  it('uses a six-digit hex color for every suite', () => {
    for (const suite of suites) {
      expect(suite.color, suite.id).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})
