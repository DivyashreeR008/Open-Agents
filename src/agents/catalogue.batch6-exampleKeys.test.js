import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent example inputs', () => {
  it('only uses example keys that map to a declared input', () => {
    for (const agent of agents) {
      if (!agent.exampleInputs) continue
      const ids = new Set(agent.inputs.map((input) => input.id))
      for (const key of Object.keys(agent.exampleInputs)) {
        expect(ids.has(key), agent.id + ':' + key).toBe(true)
      }
    }
  })
})
