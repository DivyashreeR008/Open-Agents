import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent placeholder uniqueness', () => {
  it('does not repeat the same placeholder inside one agent form', () => {
    for (const agent of agents) {
      const seen = new Set()
      for (const input of agent.inputs) {
        if (input.placeholder === undefined) continue
        expect(seen.has(input.placeholder), agent.id + ':' + input.id).toBe(false)
        seen.add(input.placeholder)
      }
    }
  })
})
