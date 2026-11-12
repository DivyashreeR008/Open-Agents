import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent category values', () => {
  it('gives every agent a non-empty category string', () => {
    for (const agent of agents) {
      expect(typeof agent.category, agent.id).toBe('string')
      expect(agent.category.trim().length, agent.id).toBeGreaterThan(0)
    }
  })
})
