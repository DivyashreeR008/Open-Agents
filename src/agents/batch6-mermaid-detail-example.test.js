import { describe, expect, it } from 'vitest'
import agent from './definitions/mermaid-diagram-generator'

describe('Mermaid diagram detail example', () => {
  it('uses the full detail option value in the example', () => {
    const detail = agent.inputs.find((input) => input.id === 'detail')
    expect(detail.options).toContain(agent.exampleInputs.detail)
  })
})
