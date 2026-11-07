import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
  streamAgent: vi.fn(),
  resolveAgentModel: vi.fn(),
  recordAnalyticsRun: vi.fn(),
}))

vi.mock('./llmAdapter', () => ({
  streamAgent: mocks.streamAgent,
}))

vi.mock('./resolveAgentModel', () => ({
  resolveAgentModel: mocks.resolveAgentModel,
}))

vi.mock('./useAnalytics', () => ({
  recordAnalyticsRun: mocks.recordAnalyticsRun,
}))

import { useScheduler } from './useScheduler'

const notifications = []

class MockNotification {
  static permission = 'granted'

  constructor(title, options) {
    notifications.push({ title, options })
  }
}

const agentDefinition = {
  id: 'agent-1',
  name: 'Code Reviewer',
  category: 'Engineering',
  provider: 'any',
  systemPrompt: 'Review the change carefully.',
  inputs: [
    { id: 'topic', label: 'Topic' },
    { id: 'format', label: 'Format' },
  ],
}

const jobData = {
  agentId: 'agent-1',
  agentName: 'Code Reviewer',
  agentDefinition,
  inputs: { topic: 'Authentication', format: ['json', 'markdown'] },
  provider: 'openai',
  model: 'saved-model',
  apiKey: 'sk-secret',
  schedule: 'daily',
  label: 'Daily review',
}

function seedJob(overrides = {}) {
  const nextRunAt = overrides.nextRunAt ?? Date.now() - 1_000
  const job = {
    id: 'job-due',
    agentId: 'agent-1',
    agentName: 'Code Reviewer',
    agentDefinition,
    inputs: { topic: 'Authentication' },
    provider: 'openai',
    model: 'saved-model',
    schedule: 'daily',
    label: 'Due review',
    createdAt: Date.now() - 10_000,
    lastRunAt: null,
    nextRunAt,
    enabled: true,
    ...overrides,
  }
  localStorage.setItem('oa_scheduled_jobs', JSON.stringify([job]))
  return job
}

function seedKey(jobId, key = 'sk-seeded') {
  sessionStorage.setItem(`oa_scheduler_key_${jobId}`, key)
}

describe('useScheduler storage and scheduling edges', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    notifications.length = 0
    mocks.streamAgent.mockReset()
    mocks.resolveAgentModel.mockReset()
    mocks.recordAnalyticsRun.mockReset()
    mocks.streamAgent.mockResolvedValue({ content: 'Model output', duration: 42 })
    mocks.resolveAgentModel.mockReturnValue('resolved-model')
    MockNotification.permission = 'granted'
    window.Notification = MockNotification
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete window.Notification
  })

  it('starts empty when stored jobs, results, and session keys cannot be read', () => {
    const originalGetItem = Storage.prototype.getItem
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function getItem(key) {
      if (this === sessionStorage) throw new Error('session blocked')
      return originalGetItem.call(this, key)
    })
    localStorage.setItem('oa_scheduled_jobs', '{broken')
    localStorage.setItem('oa_scheduler_results', '[broken')

    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    expect(result.current.jobs).toEqual([])
    expect(result.current.results).toEqual([])
  })

  it('runs with an explicit provider, an unknown schedule, and no notification support', async () => {
    delete window.Notification
    const definition = {
      id: 'agent-2',
      name: 'Writer',
      provider: 'anthropic',
      systemPrompt: 'Write the brief.',
      inputs: [{ id: 'topic', label: 'Topic' }],
    }
    mocks.streamAgent.mockImplementationOnce(async (request) => {
      request.onChunk('partial')
      return { content: 'Draft ready', duration: 7 }
    })

    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob({
        agentId: 'agent-2',
        agentName: 'Writer',
        agentDefinition: definition,
        inputs: { topic: 'News' },
        provider: 'openai',
        model: 'saved-model',
        apiKey: 'sk-writer',
        schedule: 'custom',
        label: 'Custom cadence',
      })
    })

    let run
    await act(async () => {
      run = await result.current.runJob(job)
    })

    expect(mocks.resolveAgentModel).toHaveBeenCalledWith(definition, 'anthropic', 'saved-model')
    expect(mocks.recordAnalyticsRun).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Scheduled', provider: 'anthropic' })
    )
    expect(run).toMatchObject({ output: 'Draft ready', error: null })
    expect(notifications).toHaveLength(0)
    expect(result.current.jobs[0].nextRunAt).toBe(
      result.current.jobs[0].lastRunAt + 24 * 60 * 60 * 1000
    )
  })

  it('uses a generic message when a failed run has no error message', async () => {
    mocks.streamAgent.mockRejectedValueOnce({})
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })

    let run
    await act(async () => {
      run = await result.current.runJob(job)
    })

    expect(run.error).toBe('Unknown error')
    expect(notifications[0].title).toContain('Failed: Daily review')
  })

  it('skips a due job that is still running when the minute check fires', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const dueJob = seedJob({ id: 'job-due', nextRunAt: Date.now() })
    const futureJob = {
      ...dueJob,
      id: 'job-future',
      label: 'Future review',
      nextRunAt: Date.now() + 120_000,
    }
    localStorage.setItem('oa_scheduled_jobs', JSON.stringify([dueJob, futureJob]))
    seedKey('job-due')
    seedKey('job-future')

    let finish
    mocks.streamAgent.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve
      })
    )

    const { result } = renderHook(() => useScheduler())

    expect(mocks.streamAgent).toHaveBeenCalledTimes(1)
    expect(result.current.running['job-due']).toBe(true)

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(mocks.streamAgent).toHaveBeenCalledTimes(1)

    await act(async () => {
      finish({ content: 'finished', duration: 3 })
      await Promise.resolve()
    })
    expect(result.current.running['job-due']).toBe(false)
  })
})
