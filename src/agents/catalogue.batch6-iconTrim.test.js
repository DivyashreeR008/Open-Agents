import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent icon whitespace', () => {
  it('does not pad icon names with leading or trailing whitespace', () => {
    for (const agent of agents) {
      expect(agent.icon, agent.id).toBe(agent.icon.trim())
    }
  })
})
