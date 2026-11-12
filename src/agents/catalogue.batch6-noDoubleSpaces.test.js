import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent display text whitespace', () => {
  it('does not use repeated spaces inside names or descriptions', () => {
    for (const agent of agents) {
      expect(agent.name, agent.id).not.toMatch(/\s{2,}/)
      expect(agent.description, agent.id).not.toMatch(/\s{2,}/)
    }
  })
})
