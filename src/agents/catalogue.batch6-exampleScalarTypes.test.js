import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent example input value types', () => {
  it('uses strings for text, textarea, code, and select examples', () => {
    for (const agent of agents) {
      if (!agent.exampleInputs) continue
      for (const input of agent.inputs) {
        const value = agent.exampleInputs[input.id]
        if (value === undefined) continue
        if (
          input.type === 'text' ||
          input.type === 'textarea' ||
          input.type === 'code' ||
          input.type === 'select'
        ) {
          expect(typeof value, agent.id + ':' + input.id).toBe('string')
        }
      }
    }
  })
})
