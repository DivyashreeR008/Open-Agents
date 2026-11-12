import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent input labels', () => {
  it('gives every input a non-empty label that is unique within its agent', () => {
    for (const agent of agents) {
      const labels = agent.inputs.map((input) => input.label)
      expect(
        labels.every((label) => typeof label === 'string' && label.trim().length > 0),
        agent.id
      ).toBe(true)
      expect(new Set(labels).size, agent.id).toBe(labels.length)
    }
  })
})
