import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent name length', () => {
  it('keeps every agent name within the catalogue display budget', () => {
    for (const agent of agents) {
      expect(agent.name.length, agent.id).toBeGreaterThan(0)
      expect(agent.name.length, agent.id).toBeLessThanOrEqual(60)
    }
  })
})
