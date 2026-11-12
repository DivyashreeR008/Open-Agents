import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent catalogue creation dates', () => {
  it('uses a valid ISO date that is not in the future when createdAt is present', () => {
    const dated = agents.filter((agent) => agent.createdAt !== undefined)
    expect(dated.length).toBeGreaterThan(0)
    for (const agent of dated) {
      expect(agent.createdAt, agent.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      const time = Date.parse(agent.createdAt + 'T00:00:00Z')
      expect(Number.isNaN(time), agent.id).toBe(false)
      expect(time, agent.id).toBeLessThanOrEqual(Date.now())
    }
  })
})
