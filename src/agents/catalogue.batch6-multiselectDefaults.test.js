import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent multiselect defaults', () => {
  it('uses an array of declared options for every multiselect default', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if (input.type !== 'multiselect' || input.defaultValue === undefined) continue
        expect(Array.isArray(input.defaultValue), agent.id + ':' + input.id).toBe(true)
        for (const value of input.defaultValue) {
          expect(input.options.includes(value), agent.id + ':' + input.id + ':' + value).toBe(true)
        }
      }
    }
  })
})
