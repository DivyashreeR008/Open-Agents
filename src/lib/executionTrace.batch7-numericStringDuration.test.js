import { describe, expect, it } from 'vitest'
import { recordStep } from './executionTrace'

describe('recordStep numeric duration strings', () => {
  it('rounds a finite numeric string instead of storing zero', () => {
    const trace = { steps: [] }
    recordStep(trace, {
      stepName: 'Run',
      durationMs: '1500.6',
      status: 'done',
      input: '',
      output: '',
    })

    expect(trace.steps[0].durationMs).toBe(1501)
  })

  it('uses zero for a non-numeric duration string', () => {
    const trace = { steps: [] }
    recordStep(trace, {
      stepName: 'Run',
      durationMs: 'soon',
      status: 'done',
      input: '',
      output: '',
    })

    expect(trace.steps[0].durationMs).toBe(0)
  })
})
