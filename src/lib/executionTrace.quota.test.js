import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { finalizeTrace } from './executionTrace'

describe('execution trace storage failure', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('returns the finalized trace when persistence throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })
    const trace = { steps: [] }

    expect(() =>
      finalizeTrace(trace, { status: 'failed', finalOutput: 'partial output' })
    ).not.toThrow()
    expect(trace.status).toBe('failed')
    expect(trace.finalOutput).toBe('partial output')
  })
})
