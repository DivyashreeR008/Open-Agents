import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearTraces,
  createTrace,
  finalizeTrace,
  formatDuration,
  loadTraces,
  recordStep,
} from './executionTrace'

const STORAGE_KEY = 'oa_execution_traces'

describe('executionTrace', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a running trace with the supplied workflow metadata', () => {
    const trace = createTrace({ workflowId: 'workflow-7', workflowTitle: 'Release review' })

    expect(trace.runId).toMatch(/^run_\d+_[a-z0-9]+$/)
    expect(trace.workflowId).toBe('workflow-7')
    expect(trace.workflowTitle).toBe('Release review')
    expect(trace.startedAt).toBe('2026-01-01T10:00:00.000Z')
    expect(trace.endedAt).toBeNull()
    expect(trace.steps).toEqual([])
    expect(trace.finalOutput).toBeNull()
    expect(trace.status).toBe('running')
  })

  it('uses empty metadata defaults when no arguments are supplied', () => {
    const trace = createTrace()

    expect(trace.workflowId).toBeNull()
    expect(trace.workflowTitle).toBe('')
  })

  it('records a normalized step and returns the same trace', () => {
    const trace = createTrace()
    const returned = recordStep(trace, {
      stepName: 'Review',
      input: 'input',
      output: null,
      durationMs: 12.6,
      status: 'done',
    })

    expect(returned).toBe(trace)
    expect(trace.steps).toEqual([
      {
        stepName: 'Review',
        stepType: 'agent',
        input: 'input',
        output: null,
        durationMs: 13,
        status: 'done',
        error: null,
      },
    ])
  })

  it('truncates oversized step payloads and preserves a supplied step type', () => {
    const trace = createTrace()
    const longInput = 'a'.repeat(8001)
    const longOutput = 'b'.repeat(9000)

    recordStep(trace, {
      stepName: 'Long step',
      stepType: 'tool',
      input: longInput,
      output: longOutput,
      durationMs: 1,
      status: 'failed',
      error: 'timeout',
    })

    const step = trace.steps[0]
    expect(step.stepType).toBe('tool')
    expect(step.input).toHaveLength(8000 + '\n... [truncated]'.length)
    expect(step.input.endsWith('\n... [truncated]')).toBe(true)
    expect(step.output.endsWith('\n... [truncated]')).toBe(true)
    expect(step.error).toBe('timeout')
  })

  it('finalizes a trace and persists the truncated final output', () => {
    const trace = createTrace({ workflowTitle: 'Run one' })

    finalizeTrace(trace, { status: 'failed', finalOutput: 'x'.repeat(9000) })

    expect(trace.status).toBe('failed')
    expect(trace.endedAt).toBe('2026-01-01T10:00:00.000Z')
    expect(trace.finalOutput.endsWith('\n... [truncated]')).toBe(true)
    expect(loadTraces()).toHaveLength(1)
    expect(loadTraces()[0].workflowTitle).toBe('Run one')
  })

  it('keeps the newest twenty traces and drops the oldest entries', () => {
    for (let index = 0; index < 25; index += 1) {
      finalizeTrace(createTrace({ workflowTitle: `trace-${index}` }), {
        status: 'done',
        finalOutput: 'ok',
      })
    }

    const traces = loadTraces()
    expect(traces).toHaveLength(20)
    expect(traces[0].workflowTitle).toBe('trace-24')
    expect(traces[19].workflowTitle).toBe('trace-5')
  })

  it('returns an empty list for malformed or non-array storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    expect(loadTraces()).toEqual([])

    localStorage.setItem(STORAGE_KEY, '{"trace":true}')
    expect(loadTraces()).toEqual([])

    localStorage.removeItem(STORAGE_KEY)
    expect(loadTraces()).toEqual([])
  })

  it('clears only the trace storage key', () => {
    localStorage.setItem('unrelated', 'keep me')
    finalizeTrace(createTrace(), { status: 'done' })
    expect(loadTraces()).toHaveLength(1)

    clearTraces()

    expect(loadTraces()).toEqual([])
    expect(localStorage.getItem('unrelated')).toBe('keep me')
  })

  it('formats durations across millisecond, second, and minute boundaries', () => {
    expect(formatDuration(-1)).toBe('0ms')
    expect(formatDuration(Number.NaN)).toBe('0ms')
    expect(formatDuration(0)).toBe('0ms')
    expect(formatDuration(12.4)).toBe('12ms')
    expect(formatDuration(999)).toBe('999ms')
    expect(formatDuration(1000)).toBe('1.0s')
    expect(formatDuration(1500)).toBe('1.5s')
    expect(formatDuration(59999)).toBe('60.0s')
    expect(formatDuration(60000)).toBe('1m 0s')
    expect(formatDuration(125000)).toBe('2m 5s')
  })
})
