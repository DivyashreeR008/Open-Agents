import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent text defaults', () => {
  it('keeps default values for text-like inputs as strings', () => {
    const textTypes = new Set(['text', 'textarea', 'code'])
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if (textTypes.has(input.type) && input.defaultValue !== undefined) {
          expect(typeof input.defaultValue, agent.id + ':' + input.id).toBe('string')
        }
      }
    }
  })
})
