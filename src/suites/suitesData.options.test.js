import { describe, expect, it } from 'vitest'
import { suites } from './suitesData'

describe('suite quiz option integrity', () => {
  it('gives every question at least two options with tags from its own suite', () => {
    for (const suite of suites) {
      const agents = new Set(suite.agents)
      for (const question of suite.quiz.questions) {
        expect(question.options.length, `${suite.id}/${question.id}`).toBeGreaterThanOrEqual(2)
        for (const option of question.options) {
          expect(option.label.trim(), `${suite.id}/${question.id}`).not.toBe('')
          for (const tag of option.tags) {
            expect(agents.has(tag), `${suite.id}/${question.id}/${tag}`).toBe(true)
          }
        }
      }
    }
  })
})
