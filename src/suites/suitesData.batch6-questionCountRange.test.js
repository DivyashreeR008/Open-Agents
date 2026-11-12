import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite question count', () => {
  it('keeps each suite quiz between one and two questions', () => {
    for (const suite of suites) {
      expect(suite.quiz.questions.length, suite.id).toBeGreaterThanOrEqual(1)
      expect(suite.quiz.questions.length, suite.id).toBeLessThanOrEqual(2)
    }
  })
})
