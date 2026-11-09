import { beforeEach, describe, expect, it } from 'vitest'
import { createTrace, finalizeTrace, loadTraces } from './executionTrace'

describe('execution trace retention', () => {
  beforeEach(() => localStorage.clear())

  it('keeps only the twenty newest finalized traces', () => {
    for (let index = 0; index < 21; index++) {
      const trace = createTrace({ workflowTitle: `Workflow ${index}` })
      finalizeTrace(trace, { status: 'done', finalOutput: `output-${index}` })
    }

    const traces = loadTraces()

    expect(traces).toHaveLength(20)
    expect(traces[0].finalOutput).toBe('output-20')
    expect(traces.some((trace) => trace.finalOutput === 'output-0')).toBe(false)
  })
})
