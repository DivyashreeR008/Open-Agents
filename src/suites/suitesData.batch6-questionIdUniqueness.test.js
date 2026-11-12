import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite question ids', () => {
  it('keeps question ids unique inside each suite', () => {
    for (const suite of suites) {
      const ids = suite.quiz.questions.map((question) => question.id)
      expect(new Set(ids).size, suite.id).toBe(ids.length)
    }
  })
})
