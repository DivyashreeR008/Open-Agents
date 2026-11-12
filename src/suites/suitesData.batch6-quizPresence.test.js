import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite quiz presence', () => {
  it('gives every suite a quiz with at least one question', () => {
    for (const suite of suites) {
      expect(Array.isArray(suite.quiz?.questions), suite.id).toBe(true)
      expect(suite.quiz.questions.length, suite.id).toBeGreaterThanOrEqual(1)
    }
  })
})
