import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent output types', () => {
  it('gives every agent a non-empty output type', () => {
    for (const agent of agents) {
      expect(typeof agent.outputType, agent.id).toBe('string')
      expect(agent.outputType.trim().length, agent.id).toBeGreaterThan(0)
    }
  })
})
