import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('any-provider defaults', () => {
  it('names a concrete default provider for every any-provider agent', () => {
    for (const agent of agents) {
      if (agent.provider !== 'any') continue
      expect(['openai', 'anthropic', 'gemini', 'openrouter'], agent.id).toContain(
        agent.defaultProvider
      )
    }
  })
})
