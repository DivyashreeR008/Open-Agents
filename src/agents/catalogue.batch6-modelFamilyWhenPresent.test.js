import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent model family', () => {
  it('keeps a declared model aligned with its provider family', () => {
    for (const agent of agents) {
      if (!agent.model) continue
      const provider = agent.defaultProvider || agent.provider
      if (provider === 'openai') expect(agent.model, agent.id).toMatch(/^(gpt|o\d)/)
      else if (provider === 'anthropic') expect(agent.model, agent.id).toMatch(/^claude/)
      else if (provider === 'gemini') expect(agent.model, agent.id).toMatch(/^gemini/)
      else if (provider === 'openrouter') expect(agent.model, agent.id).toContain('/')
    }
  })
})
