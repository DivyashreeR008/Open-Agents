import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTrace, finalizeTrace } from './executionTrace'

describe('execution trace persistence failures', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('returns the finalized trace when storage rejects the write', () => {
    const trace = createTrace({ workflowTitle: 'Quota test' })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })

    expect(() => finalizeTrace(trace, { status: 'done', finalOutput: 'ok' })).not.toThrow()
    expect(trace.status).toBe('done')
    expect(trace.endedAt).not.toBeNull()
  })
})
