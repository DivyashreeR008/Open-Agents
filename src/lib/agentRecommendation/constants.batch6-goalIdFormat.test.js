import { describe, expect, it } from 'vitest'
import { GOAL_OPTIONS } from './constants'

describe('recommendation goal ids', () => {
  it('uses lowercase kebab-case identifiers', () => {
    for (const goal of GOAL_OPTIONS) {
      expect(goal.id, goal.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })
})
