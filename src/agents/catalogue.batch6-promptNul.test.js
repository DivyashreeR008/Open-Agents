import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent prompt characters', () => {
  it('keeps system prompts free of NUL characters', () => {
    for (const agent of agents) {
      expect(agent.systemPrompt.includes('\u0000'), agent.id).toBe(false)
    }
  })
})
