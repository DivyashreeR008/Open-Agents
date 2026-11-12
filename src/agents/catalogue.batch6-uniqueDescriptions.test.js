import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent catalogue descriptions', () => {
  it('gives every agent a unique, non-empty description', () => {
    const descriptions = agents.map((agent) => agent.description)
    expect(descriptions.every((text) => typeof text === 'string' && text.trim().length > 0)).toBe(
      true
    )
    expect(new Set(descriptions).size).toBe(agents.length)
  })
})
