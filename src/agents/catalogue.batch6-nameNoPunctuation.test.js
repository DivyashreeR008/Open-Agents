import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent name punctuation', () => {
  it('does not end an agent name with sentence punctuation', () => {
    for (const agent of agents) {
      expect(agent.name, agent.id).not.toMatch(/[.!?]$/)
    }
  })
})
