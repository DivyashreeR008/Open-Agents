import { describe, expect, it } from 'vitest'
import { GOAL_OPTIONS } from './constants'

describe('recommendation goal category lists', () => {
  it('does not repeat a category inside one goal', () => {
    for (const goal of GOAL_OPTIONS) {
      expect(new Set(goal.categories).size, goal.id).toBe(goal.categories.length)
    }
  })
})
