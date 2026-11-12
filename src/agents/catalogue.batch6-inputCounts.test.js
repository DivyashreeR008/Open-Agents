import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent input counts', () => {
  it('keeps every agent between one and twelve inputs', () => {
    for (const agent of agents) {
      expect(agent.inputs.length, agent.id).toBeGreaterThanOrEqual(1)
      expect(agent.inputs.length, agent.id).toBeLessThanOrEqual(12)
    }
  })
})
