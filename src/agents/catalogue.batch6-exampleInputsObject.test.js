import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent example input container', () => {
  it('uses a plain object whenever example inputs are declared', () => {
    for (const agent of agents) {
      if (agent.exampleInputs === undefined) continue
      expect(Array.isArray(agent.exampleInputs), agent.id).toBe(false)
      expect(typeof agent.exampleInputs, agent.id).toBe('object')
      expect(agent.exampleInputs, agent.id).not.toBeNull()
    }
  })
})
