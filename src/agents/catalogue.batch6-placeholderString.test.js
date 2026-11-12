import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent input placeholders', () => {
  it('uses a string whenever an input declares a placeholder', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if (input.placeholder !== undefined) {
          expect(typeof input.placeholder, agent.id + ':' + input.id).toBe('string')
        }
      }
    }
  })
})
