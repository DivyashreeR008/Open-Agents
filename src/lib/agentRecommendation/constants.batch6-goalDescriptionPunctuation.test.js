import { describe, expect, it } from 'vitest'
import { GOAL_OPTIONS } from './constants'

describe('recommendation goal descriptions', () => {
  it('ends every goal description with sentence punctuation', () => {
    for (const goal of GOAL_OPTIONS) {
      expect(goal.description, goal.id).toMatch(/[.!?]$/)
    }
  })
})
