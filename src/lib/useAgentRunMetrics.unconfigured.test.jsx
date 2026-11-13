import { describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

const supabaseMock = vi.hoisted(() => ({ from: vi.fn() }))

vi.mock('./supabase', () => ({
  isSupabaseConfigured: false,
  supabase: supabaseMock,
}))

import { logAgentRun, useAgentRunMetrics } from './useAgentRunMetrics'

describe('agent run metrics without Supabase', () => {
  it('reports unavailable history instead of presenting an empty table', async () => {
    const { result } = renderHook(() => useAgentRunMetrics())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.runs).toEqual([])
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.errorMessage).toMatch(/requires the optional Supabase backend/i)
    expect(result.current.errorMessage).toMatch(/retry/i)
    expect(supabaseMock.from).not.toHaveBeenCalled()
  })

  it('does not report a successful run write without a backend', async () => {
    const result = await logAgentRun({
      agentRunId: 'run-1',
      model: 'gpt-4o',
      inputTokens: 10,
      outputTokens: 5,
      status: 'success',
      durationMs: 100,
    })

    expect(result.data).toBeNull()
    expect(result.error.message).toMatch(/requires Supabase configuration/i)
    expect(supabaseMock.from).not.toHaveBeenCalled()
  })
})
