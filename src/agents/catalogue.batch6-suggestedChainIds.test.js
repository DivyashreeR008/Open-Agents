import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent suggested chains', () => {
  it('only points at existing agents and never at itself', () => {
    const ids = new Set(agents.map((agent) => agent.id))
    for (const agent of agents) {
      for (const target of agent.suggestedChainFrom || []) {
        expect(ids.has(target), agent.id + ' -> ' + target).toBe(true)
        expect(target, agent.id).not.toBe(agent.id)
      }
    }
  })
})
