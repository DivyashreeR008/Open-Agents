import { describe, expect, it } from 'vitest'
import agent from './definitions/gitignore-generator'

describe('gitignore generator multiselect examples', () => {
  it('uses arrays of declared options for operating systems and editors', () => {
    for (const id of ['os', 'editor']) {
      const input = agent.inputs.find((entry) => entry.id === id)
      expect(Array.isArray(agent.exampleInputs[id]), id).toBe(true)
      for (const value of agent.exampleInputs[id]) {
        expect(input.options, id).toContain(value)
      }
    }
  })
})
