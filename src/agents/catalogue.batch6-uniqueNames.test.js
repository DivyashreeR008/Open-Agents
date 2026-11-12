import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent catalogue names', () => {
  it('gives every agent a unique, trimmed, non-empty name', () => {
    const names = agents.map((agent) => agent.name)
    expect(
      names.every((name) => typeof name === 'string' && name.trim() === name && name.length > 0)
    ).toBe(true)
    expect(new Set(names).size).toBe(agents.length)
  })
})
