import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent option whitespace', () => {
  it('does not pad select option values with leading or trailing whitespace', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        for (const option of input.options || []) {
          expect(option, agent.id + ':' + input.id).toBe(option.trim())
        }
      }
    }
  })
})
