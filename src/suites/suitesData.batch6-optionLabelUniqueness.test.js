import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite option labels', () => {
  it('keeps option labels unique inside each question', () => {
    for (const suite of suites) {
      for (const question of suite.quiz.questions) {
        const labels = question.options.map((option) => option.label)
        expect(new Set(labels).size, suite.id + ':' + question.id).toBe(labels.length)
      }
    }
  })
})
