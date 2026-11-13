import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  streamAgent: vi.fn(),
  resolveAgentModel: vi.fn(),
  recordAnalyticsRun: vi.fn(),
}))

vi.mock('./llmAdapter', () => ({ streamAgent: mocks.streamAgent }))
vi.mock('./resolveAgentModel', () => ({ resolveAgentModel: mocks.resolveAgentModel }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: mocks.recordAnalyticsRun }))

import { MAX_RESULT_OUTPUT_CHARS, useScheduler } from './useScheduler'

const agentDefinition = {
  id: 'agent-1',
  name: 'Digest',
  category: 'Research',
  provider: 'openai',
  systemPrompt: 'Summarize.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

const jobData = {
  agentId: 'agent-1',
  agentName: 'Digest',
  agentDefinition,
  inputs: { topic: 'Storage' },
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  schedule: 'daily',
  label: 'Storage digest',
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  mocks.streamAgent.mockReset()
  mocks.resolveAgentModel.mockReset()
  mocks.recordAnalyticsRun.mockReset()
  mocks.resolveAgentModel.mockReturnValue('gpt-4o-mini')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useScheduler storage limits', () => {
  it('degrades to memory and reports storage failures instead of crashing', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError')
    })

    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    act(() => {
      result.current.addJob(jobData)
    })

    expect(result.current.jobs).toHaveLength(1)
    expect(result.current.storageError).toContain('Browser storage is full or unavailable')
  })

  it('bounds one run output and records how much was kept', async () => {
    const longOutput = 'x'.repeat(MAX_RESULT_OUTPUT_CHARS + 5_000)
    mocks.streamAgent.mockResolvedValue({ content: longOutput, duration: 12 })

    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })

    let run
    await act(async () => {
      run = await result.current.runJob(job)
    })

    expect(run.output).toHaveLength(MAX_RESULT_OUTPUT_CHARS)
    expect(run.outputTruncated).toBe(true)
    expect(run.originalOutputLength).toBe(longOutput.length)
    expect(JSON.parse(localStorage.getItem('oa_scheduler_results'))[0].output).toHaveLength(
      MAX_RESULT_OUTPUT_CHARS
    )
  })
})
