import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent select options', () => {
  it('gives every select and multiselect input unique, non-empty string options', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if (input.type !== 'select' && input.type !== 'multiselect') continue
        expect(Array.isArray(input.options), agent.id + ':' + input.id).toBe(true)
        expect(input.options.length, agent.id + ':' + input.id).toBeGreaterThan(0)
        expect(
          input.options.every((option) => typeof option === 'string' && option.trim().length > 0),
          agent.id + ':' + input.id
        ).toBe(true)
        expect(new Set(input.options).size, agent.id + ':' + input.id).toBe(input.options.length)
      }
    }
  })
})
