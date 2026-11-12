import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent system prompts', () => {
  it('gives every agent a substantial system prompt', () => {
    for (const agent of agents) {
      expect(typeof agent.systemPrompt, agent.id).toBe('string')
      expect(agent.systemPrompt.trim().length, agent.id).toBeGreaterThanOrEqual(200)
    }
  })
})
