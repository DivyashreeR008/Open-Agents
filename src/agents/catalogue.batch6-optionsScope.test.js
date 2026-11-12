import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent option scope', () => {
  it('only declares options on select and multiselect inputs', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if (!['select', 'multiselect'].includes(input.type)) {
          expect(input.options, agent.id + ':' + input.id).toBeUndefined()
        }
      }
    }
  })
})
