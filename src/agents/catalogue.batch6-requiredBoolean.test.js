import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent required flags', () => {
  it('uses a boolean whenever an input declares required', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if ('required' in input) {
          expect(typeof input.required, agent.id + ':' + input.id).toBe('boolean')
        }
      }
    }
  })
})
