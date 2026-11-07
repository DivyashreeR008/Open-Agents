import { beforeEach, describe, expect, it } from 'vitest'
import { createTrace, recordStep } from './executionTrace'

describe('step duration normalization', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults a missing duration to zero instead of NaN', () => {
    const trace = createTrace()
    recordStep(trace, {
      stepName: 'Missing timing',
      input: null,
      output: null,
      status: 'done',
    })

    expect(trace.steps[0].durationMs).toBe(0)
  })

  it('accepts numeric strings from persisted runs', () => {
    const trace = createTrace()
    recordStep(trace, {
      stepName: 'String timing',
      input: null,
      output: null,
      durationMs: '12.6',
      status: 'done',
    })

    expect(trace.steps[0].durationMs).toBe(13)
  })

  it('normalizes non-finite durations to zero', () => {
    const trace = createTrace()
    for (const durationMs of [Infinity, -Infinity, NaN, undefined]) {
      recordStep(trace, {
        stepName: 'Invalid timing',
        input: null,
        output: null,
        durationMs,
        status: 'failed',
      })
    }

    expect(trace.steps.map((step) => step.durationMs)).toEqual([0, 0, 0, 0])
  })
})
