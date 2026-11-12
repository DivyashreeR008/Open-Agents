import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite option tags', () => {
  it('keeps tags unique inside each option', () => {
    for (const suite of suites) {
      for (const question of suite.quiz.questions) {
        for (const option of question.options) {
          expect(new Set(option.tags).size, suite.id + ':' + question.id).toBe(option.tags.length)
        }
      }
    }
  })
})
