import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent option counts', () => {
  it('offers at least one option and no runaway option list', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if (input.type !== 'select' && input.type !== 'multiselect') continue
        expect(input.options.length, agent.id + ':' + input.id).toBeGreaterThanOrEqual(1)
        expect(input.options.length, agent.id + ':' + input.id).toBeLessThanOrEqual(50)
      }
    }
  })
})
