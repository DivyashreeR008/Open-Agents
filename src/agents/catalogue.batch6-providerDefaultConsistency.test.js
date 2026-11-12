import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent provider consistency', () => {
  it('keeps a fixed provider aligned with its declared default provider', () => {
    for (const agent of agents) {
      if (agent.provider === 'any' || !agent.defaultProvider) continue
      expect(agent.defaultProvider, agent.id).toBe(agent.provider)
    }
  })
})
