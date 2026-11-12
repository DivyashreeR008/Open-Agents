import { describe, expect, it } from 'vitest'
import { GOAL_OPTIONS } from './constants'
import { CATEGORIES } from '../../agents/categories'

describe('recommendation goal categories', () => {
  it('only references categories that exist in the agent catalogue', () => {
    const known = new Set(CATEGORIES.map((category) => category.name ?? category))
    for (const goal of GOAL_OPTIONS) {
      for (const category of goal.categories) {
        expect(known.has(category), goal.id + ':' + category).toBe(true)
      }
    }
  })
})
