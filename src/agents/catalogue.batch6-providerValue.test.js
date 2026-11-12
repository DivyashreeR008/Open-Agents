import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent provider values', () => {
  it('gives every agent a non-empty provider string', () => {
    for (const agent of agents) {
      expect(typeof agent.provider, agent.id).toBe('string')
      expect(agent.provider.trim().length, agent.id).toBeGreaterThan(0)
    }
  })
})
