import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent suggested chain entry types', () => {
  it('stores every predecessor as a non-empty string', () => {
    for (const agent of agents) {
      for (const target of agent.suggestedChainFrom || []) {
        expect(typeof target, agent.id).toBe('string')
        expect(target.trim().length, agent.id).toBeGreaterThan(0)
      }
    }
  })
})
