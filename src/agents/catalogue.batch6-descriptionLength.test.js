import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent description length', () => {
  it('keeps every description between 40 and 240 characters', () => {
    for (const agent of agents) {
      expect(agent.description.length, agent.id).toBeGreaterThanOrEqual(40)
      expect(agent.description.length, agent.id).toBeLessThanOrEqual(240)
    }
  })
})
