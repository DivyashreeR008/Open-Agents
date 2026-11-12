import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent name uniqueness by case', () => {
  it('does not ship two names that differ only by letter case', () => {
    const seen = new Map()
    for (const agent of agents) {
      const key = agent.name.toLowerCase()
      expect(seen.has(key), agent.id + ' duplicates ' + seen.get(key)).toBe(false)
      seen.set(key, agent.id)
    }
  })
})
