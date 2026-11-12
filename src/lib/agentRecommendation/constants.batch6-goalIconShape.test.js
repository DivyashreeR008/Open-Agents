import { describe, expect, it } from 'vitest'
import { GOAL_OPTIONS } from './constants'

describe('recommendation goal icons', () => {
  it('stores a renderable icon component for every goal', () => {
    for (const goal of GOAL_OPTIONS) {
      expect(goal.icon, goal.id).toBeTruthy()
      expect(['function', 'object'], goal.id).toContain(typeof goal.icon)
    }
  })
})
