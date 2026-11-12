import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent required inputs', () => {
  it('marks at least one input as required for every agent', () => {
    for (const agent of agents) {
      expect(
        agent.inputs.some((input) => input.required === true),
        agent.id
      ).toBe(true)
    }
  })
})
