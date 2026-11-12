import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent model values', () => {
  it('stores a trimmed, non-empty string whenever a model is declared', () => {
    for (const agent of agents) {
      if (agent.model === undefined) continue
      expect(typeof agent.model, agent.id).toBe('string')
      expect(agent.model.trim().length, agent.id).toBeGreaterThan(0)
      expect(agent.model, agent.id).toBe(agent.model.trim())
    }
  })
})
