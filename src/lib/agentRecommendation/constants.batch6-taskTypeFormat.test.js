import { describe, expect, it } from 'vitest'
import { GOAL_OPTIONS } from './constants'

describe('recommendation task types', () => {
  it('uses lowercase, non-empty task names', () => {
    for (const goal of GOAL_OPTIONS) {
      for (const task of goal.taskTypes) {
        expect(task.length, goal.id).toBeGreaterThan(0)
        expect(task, goal.id).toBe(task.toLowerCase())
      }
    }
  })
})
