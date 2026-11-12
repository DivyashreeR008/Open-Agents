import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent system prompt uniqueness', () => {
  it('does not reuse the same system prompt across two agents', () => {
    const seen = new Map()
    for (const agent of agents) {
      expect(
        seen.has(agent.systemPrompt),
        agent.id + ' duplicates ' + seen.get(agent.systemPrompt)
      ).toBe(false)
      seen.set(agent.systemPrompt, agent.id)
    }
  })
})
