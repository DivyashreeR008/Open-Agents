import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

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

import { SCHEDULE_OPTIONS, useScheduler } from './useScheduler'

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
  inputs: { topic: 'Authentication', format: ['json', 'markdown'], ignored: '' },
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

describe('useScheduler', () => {
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
    delete window.Notification
  })

  it('exports the documented schedule intervals', () => {
    expect(SCHEDULE_OPTIONS).toEqual([
      { value: 'hourly', label: 'Every hour', ms: 60 * 60 * 1000 },
      { value: 'daily', label: 'Every day', ms: 24 * 60 * 60 * 1000 },
      { value: 'weekly', label: 'Every week', ms: 7 * 24 * 60 * 60 * 1000 },
    ])
  })

  it('creates a job, stores its secret in session storage, and persists a safe copy', () => {
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    const before = Date.now()

    let job
    act(() => {
      job = result.current.addJob(jobData)
    })
    const after = Date.now()

    expect(job.id).toMatch(/^job_\d+_[a-z0-9]+$/)
    expect(job.createdAt).toBeGreaterThanOrEqual(before)
    expect(job.createdAt).toBeLessThanOrEqual(after)
    expect(job.nextRunAt).toBe(job.createdAt + 24 * 60 * 60 * 1000)
    expect(job.enabled).toBe(true)
    expect(job.apiKey).toBe('sk-secret')
    expect(result.current.jobs[0]).toMatchObject({
      id: job.id,
      label: 'Daily review',
      enabled: true,
    })
    expect(sessionStorage.getItem(`oa_scheduler_key_${job.id}`)).toBe('sk-secret')

    const persisted = JSON.parse(localStorage.getItem('oa_scheduled_jobs'))
    expect(persisted[0]).not.toHaveProperty('apiKey')
    expect(persisted[0].id).toBe(job.id)
  })

  it('uses a twenty-four-hour fallback for an unknown schedule', () => {
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob({ ...jobData, schedule: 'custom' })
    })

    expect(job.nextRunAt).toBe(job.createdAt + 24 * 60 * 60 * 1000)
  })

  it('toggles a job and removes its session key on delete', () => {
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })

    act(() => {
      result.current.toggleJob(job.id)
    })
    expect(result.current.jobs[0].enabled).toBe(false)

    act(() => {
      result.current.deleteJob(job.id)
    })
    expect(result.current.jobs).toEqual([])
    expect(sessionStorage.getItem(`oa_scheduler_key_${job.id}`)).toBeNull()
  })

  it('rehydrates a session key without writing it back to persistent storage', () => {
    seedJob()
    seedKey('job-due')
    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    expect(result.current.jobs[0].apiKey).toBe('sk-seeded')
    expect(JSON.parse(localStorage.getItem('oa_scheduled_jobs'))[0]).not.toHaveProperty('apiKey')
  })

  it('runs a job, records analytics, stores history, and advances the schedule', async () => {
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })

    let run
    await act(async () => {
      run = await result.current.runJob(job)
    })

    expect(mocks.streamAgent).toHaveBeenCalledTimes(1)
    const request = mocks.streamAgent.mock.calls[0][0]
    expect(request).toMatchObject({
      provider: 'openai',
      model: 'resolved-model',
      apiKey: 'sk-secret',
      systemPrompt: 'Review the change carefully.',
    })
    expect(request.userMessage).toBe('Topic: Authentication\n\nFormat: json, markdown')
    expect(mocks.resolveAgentModel).toHaveBeenCalledWith(agentDefinition, 'openai', 'saved-model')
    expect(mocks.recordAnalyticsRun).toHaveBeenCalledWith({
      agentId: 'agent-1',
      agentName: 'Code Reviewer',
      category: 'Engineering',
      provider: 'openai',
      model: 'resolved-model',
      duration: 42,
    })
    expect(run).toMatchObject({
      jobId: job.id,
      jobLabel: 'Daily review',
      agentName: 'Code Reviewer',
      output: 'Model output',
      error: null,
    })
    expect(result.current.results[0]).toBe(run)
    expect(result.current.jobs[0].lastRunAt).not.toBeNull()
    expect(result.current.jobs[0].nextRunAt).toBe(
      result.current.jobs[0].lastRunAt + 24 * 60 * 60 * 1000
    )
    expect(result.current.running[job.id]).toBe(false)
    expect(notifications).toHaveLength(1)
    expect(notifications[0].title).toContain('Completed: Daily review')
  })

  it('records a failed run, notifies the user, and clears the running flag', async () => {
    mocks.streamAgent.mockRejectedValueOnce(new Error('provider unavailable'))
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })

    let run
    await act(async () => {
      run = await result.current.runJob(job)
    })

    expect(run.output).toBe('')
    expect(run.error).toBe('provider unavailable')
    expect(result.current.results[0].error).toBe('provider unavailable')
    expect(result.current.jobs[0].lastRunAt).not.toBeNull()
    expect(result.current.running[job.id]).toBe(false)
    expect(notifications[0].title).toContain('Failed: Daily review')
  })

  it('does not notify when permission is denied', async () => {
    MockNotification.permission = 'denied'
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })

    await act(async () => {
      await result.current.runJob(job)
    })

    expect(notifications).toHaveLength(0)
  })

  it('does not start the same job twice while it is running', async () => {
    let finish
    mocks.streamAgent.mockReturnValueOnce(
      new Promise((resolve) => {
        finish = resolve
      })
    )
    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })

    let first
    act(() => {
      first = result.current.runJob(job)
    })
    expect(result.current.running[job.id]).toBe(true)

    await expect(result.current.runJob(job)).resolves.toBeNull()
    expect(mocks.streamAgent).toHaveBeenCalledTimes(1)

    await act(async () => {
      finish({ content: 'finished', duration: 2 })
      await first
    })
    expect(result.current.running[job.id]).toBe(false)
  })

  it('runs an enabled due job automatically when a key is stored', async () => {
    seedJob()
    seedKey('job-due')
    const { result } = renderHook(() => useScheduler())

    await waitFor(() => expect(mocks.streamAgent).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(result.current.results).toHaveLength(1))
    expect(result.current.results[0].output).toBe('Model output')
  })

  it('skips disabled jobs and jobs without a stored key during the due check', () => {
    const disabled = seedJob({ id: 'disabled-job', enabled: false })
    const keyless = seedJob({ id: 'keyless-job' })
    localStorage.setItem(
      'oa_scheduled_jobs',
      JSON.stringify([disabled, keyless].map(({ id, ...job }) => ({ id, ...job })))
    )
    seedKey('disabled-job')

    renderHook(() => useScheduler())

    expect(mocks.streamAgent).not.toHaveBeenCalled()
  })

  it('does not run due jobs when automatic checks are disabled', () => {
    seedJob()
    seedKey('job-due')

    renderHook(() => useScheduler({ autoRun: false }))

    expect(mocks.streamAgent).not.toHaveBeenCalled()
  })

  it('keeps at most fifty stored runs', async () => {
    const existing = Array.from({ length: 50 }, (_, index) => ({
      id: `old-${index}`,
      jobId: 'old-job',
      output: `old-${index}`,
    }))
    localStorage.setItem('oa_scheduler_results', JSON.stringify(existing))

    const { result } = renderHook(() => useScheduler({ autoRun: false }))
    let job
    act(() => {
      job = result.current.addJob(jobData)
    })
    await act(async () => {
      await result.current.runJob(job)
    })

    expect(result.current.results).toHaveLength(50)
    expect(result.current.results[0].output).toBe('Model output')
    expect(result.current.results[49].id).toBe('old-48')
  })

  it('deletes one run and clears all runs for a job', () => {
    localStorage.setItem(
      'oa_scheduler_results',
      JSON.stringify([
        { id: 'r1', jobId: 'job-a', output: 'one' },
        { id: 'r2', jobId: 'job-b', output: 'two' },
      ])
    )
    const { result } = renderHook(() => useScheduler({ autoRun: false }))

    act(() => {
      result.current.clearResultsForJob('job-a')
    })
    expect(result.current.results.map((run) => run.id)).toEqual(['r2'])

    act(() => {
      result.current.deleteResult('r2')
    })
    expect(result.current.results).toEqual([])
  })
})
