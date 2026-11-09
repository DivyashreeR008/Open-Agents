import { afterEach, describe, expect, it } from 'vitest'
import { clearTraces, createTrace, finalizeTrace, recordStep } from './executionTrace'

describe('execution trace step normalization', () => {
  afterEach(() => clearTraces())

  it('truncates large payloads, rounds durations, and defaults the step type', () => {
    const trace = createTrace()
    recordStep(trace, {
      stepName: 'Long step',
      input: 'x'.repeat(9000),
      output: null,
      durationMs: 12.6,
      status: 'done',
    })

    expect(trace.steps[0].stepType).toBe('agent')
    expect(trace.steps[0].durationMs).toBe(13)
    expect(trace.steps[0].input).toContain('... [truncated]')
    expect(trace.steps[0].input.length).toBeLessThan(9000)
  })

  it('uses zero for a non-numeric duration and persists the final trace', () => {
    const trace = createTrace({ workflowId: 'wf-1', workflowTitle: 'Flow' })
    recordStep(trace, {
      stepName: 'Bad duration',
      stepType: 'tool',
      input: 'in',
      output: 'out',
      durationMs: 'nope',
      status: 'failed',
      error: 'boom',
    })
    finalizeTrace(trace, { status: 'failed', finalOutput: 'x'.repeat(9000) })

    expect(trace.steps[0].durationMs).toBe(0)
    expect(trace.status).toBe('failed')
    expect(trace.endedAt).toBeTruthy()
    expect(trace.finalOutput).toContain('... [truncated]')
  })
})
