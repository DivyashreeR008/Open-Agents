import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent display text characters', () => {
  it('keeps names and descriptions free of control characters', () => {
    const control = /[\u0000-\u001F\u007F]/
    for (const agent of agents) {
      expect(control.test(agent.name), agent.id).toBe(false)
      expect(control.test(agent.description), agent.id).toBe(false)
    }
  })
})
