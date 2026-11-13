import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const supabaseMock = vi.hoisted(() => ({ from: vi.fn() }))

vi.mock('./supabase', () => ({ supabase: supabaseMock }))

import {
  AGENT_RUN_PAGE_SIZE,
  estimateCost,
  logAgentRun,
  useAgentRunMetrics,
} from './useAgentRunMetrics'

function mockQuery(result) {
  const order = vi.fn().mockResolvedValue(result)
  const gte = vi.fn().mockReturnValue({ order })
  const select = vi.fn().mockReturnValue({ gte })
  supabaseMock.from.mockReturnValue({ select })
  return { select, gte, order }
}

function mockPagedQuery(pages) {
  let request = 0
  const range = vi.fn().mockImplementation(() => {
    const page = pages[Math.min(request, pages.length - 1)]
    request += 1
    return Promise.resolve(page)
  })
  const order = vi.fn().mockReturnValue({ range })
  const gte = vi.fn().mockReturnValue({ order })
  const select = vi.fn().mockReturnValue({ gte })
  supabaseMock.from.mockReturnValue({ select })
  return { select, gte, order, range }
}

describe('estimateCost', () => {
  it('prices known models from input and output tokens', () => {
    expect(estimateCost('gpt-4o', 2000, 1000)).toBeCloseTo(0.025)
    expect(estimateCost('claude-sonnet', 1000, 2000)).toBeCloseTo(0.033)
  })

  it('returns null for an unknown model instead of zero', () => {
    expect(estimateCost('mystery-model', 1000, 1000)).toBeNull()
  })
})

describe('logAgentRun', () => {
  beforeEach(() => {
    supabaseMock.from.mockReset()
  })

  it('writes the estimated cost with the run', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null })
    supabaseMock.from.mockReturnValue({ insert })

    await logAgentRun({
      agentRunId: 'run-1',
      model: 'gpt-4o',
      inputTokens: 1000,
      outputTokens: 500,
      status: 'success',
      durationMs: 1200,
    })

    expect(supabaseMock.from).toHaveBeenCalledWith('agent_runs')
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        agent_run_id: 'run-1',
        estimated_cost_usd: expect.closeTo(0.0125, 5),
        status: 'success',
        duration_ms: 1200,
      })
    )
  })

  it('records null cost for an unpriced model', async () => {
    const insert = vi.fn().mockResolvedValue({ error: null })
    supabaseMock.from.mockReturnValue({ insert })

    await logAgentRun({
      agentRunId: 'run-2',
      model: 'unknown',
      inputTokens: 10,
      outputTokens: 20,
      status: 'failed',
      durationMs: 50,
    })

    expect(insert.mock.calls[0][0].estimated_cost_usd).toBeNull()
  })

  it('returns an error instead of throwing when the write fails', async () => {
    const insert = vi.fn().mockRejectedValue(new Error('write offline'))
    supabaseMock.from.mockReturnValue({ insert })

    const result = await logAgentRun({
      agentRunId: 'run-3',
      model: 'gpt-4o',
      inputTokens: 10,
      outputTokens: 20,
      status: 'success',
      durationMs: 50,
    })

    expect(result.data).toBeNull()
    expect(result.error.message).toBe('write offline')
  })
})

describe('useAgentRunMetrics', () => {
  beforeEach(() => {
    supabaseMock.from.mockReset()
  })

  it('summarises runs and ignores unknown costs', async () => {
    const query = mockQuery({
      error: null,
      data: [
        {
          status: 'success',
          input_tokens: 100,
          output_tokens: 50,
          estimated_cost_usd: 0.2,
          duration_ms: 300,
        },
        {
          status: 'failed',
          input_tokens: 10,
          output_tokens: 5,
          estimated_cost_usd: null,
          duration_ms: 100,
        },
        {
          status: 'success',
          estimated_cost_usd: 0.1,
        },
      ],
    })

    const { result } = renderHook(() => useAgentRunMetrics(7))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(query.gte).toHaveBeenCalledWith(
      'timestamp',
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
    )
    expect(query.order).toHaveBeenCalledWith('timestamp', { ascending: false })
    expect(result.current.totalRuns).toBe(3)
    expect(result.current.successRate).toBeCloseTo(66.67, 1)
    expect(result.current.totalTokens).toBe(165)
    expect(result.current.totalCostUSD).toBeCloseTo(0.3)
    expect(result.current.unknownCostRuns).toBe(1)
    expect(result.current.avgDurationMs).toBeCloseTo(133.33, 1)
  })

  it('keeps an empty state when the query fails or returns nothing', async () => {
    mockQuery({ error: { message: 'offline' }, data: null })

    const { result } = renderHook(() => useAgentRunMetrics())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.runs).toEqual([])
    expect(result.current.error?.message).toBe('offline')
    expect(result.current.errorMessage).toBe('offline')
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.totalRuns).toBe(0)
    expect(result.current.successRate).toBe(0)
    expect(result.current.totalTokens).toBe(0)
    expect(result.current.totalCostUSD).toBe(0)
    expect(result.current.avgDurationMs).toBe(0)
  })

  it('loads histories in bounded pages instead of truncating at the first response', async () => {
    const firstPage = Array.from({ length: AGENT_RUN_PAGE_SIZE }, (_, index) => ({
      status: 'success',
      input_tokens: 1,
      output_tokens: 1,
      estimated_cost_usd: 0,
      duration_ms: 10,
      id: `run-${index}`,
    }))
    const query = mockPagedQuery([
      { error: null, data: firstPage },
      { error: null, data: [{ status: 'failed', input_tokens: 2, output_tokens: 3 }] },
    ])

    const { result } = renderHook(() => useAgentRunMetrics())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.runs).toHaveLength(AGENT_RUN_PAGE_SIZE + 1)
    expect(result.current.totalRuns).toBe(AGENT_RUN_PAGE_SIZE + 1)
    expect(result.current.error).toBeNull()
    expect(result.current.isEmpty).toBe(false)
    expect(query.range).toHaveBeenNthCalledWith(1, 0, AGENT_RUN_PAGE_SIZE - 1)
    expect(query.range).toHaveBeenNthCalledWith(2, AGENT_RUN_PAGE_SIZE, AGENT_RUN_PAGE_SIZE * 2 - 1)
    expect(supabaseMock.from).toHaveBeenCalledTimes(2)
  })

  it('exposes a retry path that clears a failed load', async () => {
    const query = mockPagedQuery([
      { error: { message: 'temporary outage' }, data: null },
      {
        error: null,
        data: [
          {
            status: 'success',
            input_tokens: 5,
            output_tokens: 10,
            estimated_cost_usd: 0.01,
            duration_ms: 200,
          },
        ],
      },
    ])
    const { result } = renderHook(() => useAgentRunMetrics())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.errorMessage).toBe('temporary outage')
    expect(result.current.runs).toEqual([])
    expect(result.current.isEmpty).toBe(false)

    await act(async () => {
      await result.current.refetch()
    })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
    expect(result.current.errorMessage).toBe('')
    expect(result.current.runs).toHaveLength(1)
    expect(result.current.isEmpty).toBe(false)
    expect(query.range).toHaveBeenCalledTimes(2)
  })

  it('can refetch on demand', async () => {
    mockQuery({ error: null, data: [] })
    const { result } = renderHook(() => useAgentRunMetrics())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isEmpty).toBe(true)
    await act(async () => {
      await result.current.refetch()
    })

    expect(supabaseMock.from).toHaveBeenCalledTimes(2)
  })
})
