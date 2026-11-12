import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

const SUPPORTED_TYPES = new Set(['text', 'textarea', 'select', 'multiselect', 'code'])

describe('agent input types', () => {
  it('uses only input types that the runner can render', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        expect(SUPPORTED_TYPES.has(input.type), agent.id + ':' + input.id + ':' + input.type).toBe(
          true
        )
      }
    }
  })
})
