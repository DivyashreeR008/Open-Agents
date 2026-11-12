import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent input label whitespace', () => {
  it('does not pad input labels with leading or trailing whitespace', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        expect(input.label, agent.id + ':' + input.id).toBe(input.label.trim())
      }
    }
  })
})
