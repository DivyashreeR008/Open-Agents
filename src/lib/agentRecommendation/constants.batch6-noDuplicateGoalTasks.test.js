import { describe, expect, it } from 'vitest'
import { GOAL_OPTIONS } from './constants'

describe('recommendation goal task lists', () => {
  it('does not repeat a task type inside one goal', () => {
    for (const goal of GOAL_OPTIONS) {
      expect(new Set(goal.taskTypes).size, goal.id).toBe(goal.taskTypes.length)
    }
  })
})
