import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent suggested chain shape', () => {
  it('stores a short, duplicate-free array whenever a chain is declared', () => {
    for (const agent of agents) {
      if (agent.suggestedChainFrom === undefined) continue
      expect(Array.isArray(agent.suggestedChainFrom), agent.id).toBe(true)
      expect(agent.suggestedChainFrom.length, agent.id).toBeLessThanOrEqual(3)
      expect(new Set(agent.suggestedChainFrom).size, agent.id).toBe(agent.suggestedChainFrom.length)
    }
  })
})
