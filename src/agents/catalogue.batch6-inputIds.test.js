import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent input identifiers', () => {
  it('gives every input a non-empty id that is unique within its agent', () => {
    for (const agent of agents) {
      const ids = agent.inputs.map((input) => input.id)
      expect(
        ids.every((id) => typeof id === 'string' && id.trim().length > 0),
        agent.id
      ).toBe(true)
      expect(new Set(ids).size, agent.id).toBe(ids.length)
    }
  })
})
