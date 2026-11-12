import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent input label punctuation', () => {
  it('does not end an input label with a colon', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        expect(input.label.endsWith(':'), agent.id + ':' + input.id).toBe(false)
      }
    }
  })
})
