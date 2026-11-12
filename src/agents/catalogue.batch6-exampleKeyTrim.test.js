import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent example key whitespace', () => {
  it('does not pad example input keys with leading or trailing whitespace', () => {
    for (const agent of agents) {
      if (!agent.exampleInputs) continue
      for (const key of Object.keys(agent.exampleInputs)) {
        expect(key, agent.id).toBe(key.trim())
      }
    }
  })
})
