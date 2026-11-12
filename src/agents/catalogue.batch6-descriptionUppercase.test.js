import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent description opening', () => {
  it('starts every description with an uppercase letter', () => {
    for (const agent of agents) {
      expect(agent.description, agent.id).toMatch(/^[A-Z]/)
    }
  })
})
