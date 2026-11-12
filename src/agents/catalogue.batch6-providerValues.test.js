import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

const PROVIDERS = new Set(['any', 'openai', 'anthropic', 'gemini', 'openrouter'])

describe('agent catalogue providers', () => {
  it('declares only supported provider identifiers', () => {
    for (const agent of agents) {
      expect(PROVIDERS.has(agent.provider), agent.id + ': ' + agent.provider).toBe(true)
    }
  })
})
