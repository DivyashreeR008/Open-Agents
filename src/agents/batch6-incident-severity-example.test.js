import { describe, expect, it } from 'vitest'
import agent from './definitions/incident-runbook-generator'

describe('incident runbook severity example', () => {
  it('uses an array of the declared severity options', () => {
    const severity = agent.inputs.find((input) => input.id === 'severity_levels')
    expect(Array.isArray(agent.exampleInputs.severity_levels)).toBe(true)
    for (const value of agent.exampleInputs.severity_levels) {
      expect(severity.options).toContain(value)
    }
  })
})
