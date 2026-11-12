import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent example key content', () => {
  it('does not declare blank example input keys', () => {
    for (const agent of agents) {
      if (!agent.exampleInputs) continue
      for (const key of Object.keys(agent.exampleInputs)) {
        expect(key.trim().length, agent.id).toBeGreaterThan(0)
      }
    }
  })
})
