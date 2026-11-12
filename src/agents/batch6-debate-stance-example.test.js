import { describe, expect, it } from 'vitest'
import agent from './definitions/debate-argument-builder'

describe('debate argument example stance', () => {
  it('uses a stance that exists in the select options', () => {
    const stance = agent.inputs.find((input) => input.id === 'stance')
    expect(stance.options).toContain(agent.exampleInputs.stance)
  })
})
