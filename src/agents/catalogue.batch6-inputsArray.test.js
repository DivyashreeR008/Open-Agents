import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent inputs containers', () => {
  it('stores every agent input collection as an array', () => {
    for (const agent of agents) {
      expect(Array.isArray(agent.inputs), agent.id).toBe(true)
      expect(agent.inputs.every(Boolean), agent.id).toBe(true)
    }
  })
})
