import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite option text', () => {
  it('gives every question and option a non-empty label', () => {
    for (const suite of suites) {
      for (const question of suite.quiz.questions) {
        expect(question.question.trim().length, suite.id).toBeGreaterThan(0)
        for (const option of question.options) {
          expect(option.label.trim().length, suite.id + ':' + question.id).toBeGreaterThan(0)
          expect(
            option.tags.every((tag) => tag.trim().length > 0),
            suite.id
          ).toBe(true)
        }
      }
    }
  })
})
