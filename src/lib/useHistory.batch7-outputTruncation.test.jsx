import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HISTORY_LIMITS, useHistory } from './useHistory'

const STORAGE_KEY = 'OpenAgents_history'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useHistory output truncation', () => {
  it('keeps the newest run while shortening an oversized output', () => {
    const { result } = renderHook(() => useHistory())

    const oversizedOutput = 'A'.repeat(HISTORY_LIMITS.outputCharacters + 2000)

    let outcome
    act(() => {
      outcome = result.current.saveRun({
        agentId: 'test-agent',
        agentName: 'Test Agent',
        provider: 'openai',
        inputs: { query: 'test' },
        output: oversizedOutput,
      })
    })

    expect(outcome.ok).toBe(true)
    expect(result.current.history).toHaveLength(1)

    const newestRun = result.current.history[0]
    expect(newestRun.agentId).toBe('test-agent')
    expect(newestRun.output).toContain('Output truncated in history')
    expect(newestRun.output.startsWith('A'.repeat(100))).toBe(true)
    expect(newestRun.output.length).toBeLessThan(oversizedOutput.length)

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(persisted).toHaveLength(1)
    expect(persisted[0].output).toBe(newestRun.output)
  })
})
