// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null }))
const provider = vi.hoisted(() => ({ runAgent: vi.fn() }))

vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: async () => keyStoreState.key,
}))
vi.mock('./llmAdapter', () => ({ runAgent: provider.runAgent }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('./supabase', () => ({ supabase: {}, isSupabaseConfigured: false }))

import {
  checkDueAutomations,
  createAutomation,
  getAutomation,
  getRunsForAutomation,
  loadAutomations,
  runAutomationNow,
  saveAutomations,
  toggleAutomation,
  updateAutomation,
} from './automationsService'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const NOW = Date.UTC(2026, 10, 3, 12, 0, 0)

async function makeAutomation(overrides = {}) {
  const created = await createAutomation({
    name: 'Daily check',
    agentId: 'a1',
    agentName: 'Agent One',
    schedule: 'daily',
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: 'sk-test-key',
    emailNotification: false,
  })
  const { missedPolicy, hasKey, nextRunAt } = overrides
  const patched = {
    ...created,
    ...(missedPolicy !== undefined ? { missedPolicy } : {}),
    ...(hasKey !== undefined ? { hasKey } : {}),
    nextRunAt: nextRunAt ?? NOW - 30_000,
    enabled: overrides.enabled ?? true,
  }
  saveAutomations([patched, ...loadAutomations().filter((a) => a.id !== created.id)])
  return patched
}

const byStatus = (id, status) => getRunsForAutomation(id).filter((r) => r.status === status)

beforeAll(() => {
  vi.stubGlobal('crypto', webcrypto)
})

beforeEach(async () => {
  localStorage.clear()
  keyStoreState.key = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
  provider.runAgent.mockReset()
  provider.runAgent.mockResolvedValue({ content: 'done', tokens: 12, duration: 5 })
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
  localStorage.setItem('oa_automations_v2', '[]')
  localStorage.setItem('oa_automation_runs_v2', '[]')
})

afterEach(() => {
  vi.useRealTimers()
})

describe('a scheduled run that is on time', () => {
  it('runs once, is not a catch-up, and keeps the cadence', async () => {
    const a = await makeAutomation({ nextRunAt: NOW - 30_000 })
    const handled = await checkDueAutomations(NOW)

    expect(handled).toEqual([{ id: a.id, ran: [NOW - 30_000], skipped: 0, missed: 0 }])
    expect(provider.runAgent).toHaveBeenCalledTimes(1)
    const [run] = byStatus(a.id, 'success')
    expect(run).toMatchObject({ scheduledFor: NOW - 30_000, catchUp: false })
    expect(byStatus(a.id, 'missed')).toHaveLength(0)
    // the next window follows the previous one, it does not drift to when the run finished
    expect(getAutomation(a.id).nextRunAt).toBe(NOW - 30_000 + DAY)
    expect(getAutomation(a.id).lastRunAt).toBe(NOW)
  })

  it('does nothing before the window is due', async () => {
    const a = await makeAutomation({ nextRunAt: NOW + HOUR })
    expect(await checkDueAutomations(NOW)).toEqual([])
    expect(provider.runAgent).not.toHaveBeenCalled()
    expect(getRunsForAutomation(a.id)).toHaveLength(0)
  })

  it('does not run twice for the same window', async () => {
    const a = await makeAutomation({ nextRunAt: NOW - 30_000 })
    await checkDueAutomations(NOW)
    await checkDueAutomations(NOW + 60_000)
    expect(provider.runAgent).toHaveBeenCalledTimes(1)
    expect(getRunsForAutomation(a.id).filter((r) => r.status === 'success')).toHaveLength(1)
  })
})

describe('when the app was closed for 3.5 days (4 daily windows, newest 12 hours late)', () => {
  const closedFor = { nextRunAt: NOW - 3.5 * DAY }

  it('run_once (the default) runs one catch-up run and records the other three as missed', async () => {
    const a = await makeAutomation(closedFor) // no missedPolicy saved: the old behaviour
    await checkDueAutomations(NOW)

    expect(provider.runAgent).toHaveBeenCalledTimes(1)
    expect(byStatus(a.id, 'success')[0]).toMatchObject({
      scheduledFor: NOW - 0.5 * DAY,
      catchUp: true,
    })
    const [missed] = byStatus(a.id, 'missed')
    expect(missed).toMatchObject({
      missedCount: 3,
      firstWindow: NOW - 3.5 * DAY,
      lastWindow: NOW - 1.5 * DAY,
      detectedAt: NOW,
      policy: 'run_once',
    })
    expect(byStatus(a.id, 'missed')).toHaveLength(1)
    expect(getAutomation(a.id).nextRunAt).toBe(NOW + 0.5 * DAY)
  })

  it('catch_up runs the three most recent windows, oldest first, and records one as missed', async () => {
    const a = await makeAutomation({ ...closedFor, missedPolicy: 'catch_up' })
    await checkDueAutomations(NOW)

    expect(provider.runAgent).toHaveBeenCalledTimes(3)
    const scheduled = byStatus(a.id, 'success')
      .map((r) => r.scheduledFor)
      .sort((x, y) => x - y)
    expect(scheduled).toEqual([NOW - 2.5 * DAY, NOW - 1.5 * DAY, NOW - 0.5 * DAY])
    expect(byStatus(a.id, 'success').every((r) => r.catchUp)).toBe(true)
    expect(byStatus(a.id, 'missed')[0]).toMatchObject({
      missedCount: 1,
      firstWindow: NOW - 3.5 * DAY,
    })
    expect(getAutomation(a.id).nextRunAt).toBe(NOW + 0.5 * DAY)
  })

  it('skip runs nothing and records all four as missed', async () => {
    const a = await makeAutomation({ ...closedFor, missedPolicy: 'skip' })
    await checkDueAutomations(NOW)

    expect(provider.runAgent).not.toHaveBeenCalled()
    expect(byStatus(a.id, 'success')).toHaveLength(0)
    expect(byStatus(a.id, 'missed')[0]).toMatchObject({ missedCount: 4, policy: 'skip' })
    expect(getAutomation(a.id).nextRunAt).toBe(NOW + 0.5 * DAY)
  })

  it('does not report the same missed windows again on the next tick', async () => {
    const a = await makeAutomation({ ...closedFor, missedPolicy: 'skip' })
    await checkDueAutomations(NOW)
    await checkDueAutomations(NOW + 60_000)
    await checkDueAutomations(NOW + 120_000)
    expect(byStatus(a.id, 'missed')).toHaveLength(1)
  })
})

describe('skip with a window that is on time', () => {
  it('runs the current window and records the earlier ones as missed', async () => {
    const a = await makeAutomation({ nextRunAt: NOW - 2 * DAY - 30_000, missedPolicy: 'skip' })
    await checkDueAutomations(NOW)
    expect(provider.runAgent).toHaveBeenCalledTimes(1)
    expect(byStatus(a.id, 'success')[0]).toMatchObject({ catchUp: false })
    expect(byStatus(a.id, 'missed')[0]).toMatchObject({ missedCount: 2 })
  })
})

describe('a long absence', () => {
  it('writes one record, not one per window, and runs a bounded number of times', async () => {
    const a = await makeAutomation({ nextRunAt: NOW - 90 * DAY, missedPolicy: 'catch_up' })
    const handled = await checkDueAutomations(NOW)
    expect(provider.runAgent).toHaveBeenCalledTimes(3)
    expect(byStatus(a.id, 'missed')).toHaveLength(1)
    expect(byStatus(a.id, 'missed')[0].missedCount).toBe(90 + 1 - 3)
    expect(handled[0].missed).toBe(88)
  })
})

describe('an automation that cannot run', () => {
  it('records windows as skipped, with the reason, when the API key is missing', async () => {
    const a = await makeAutomation({ nextRunAt: NOW - 30_000, hasKey: false })
    const handled = await checkDueAutomations(NOW)

    expect(provider.runAgent).not.toHaveBeenCalled()
    expect(handled).toEqual([{ id: a.id, ran: [], skipped: 1, missed: 0 }])
    expect(byStatus(a.id, 'skipped')[0]).toMatchObject({ skippedCount: 1, reason: 'no_key' })
    expect(getAutomation(a.id).nextRunAt).toBe(NOW - 30_000 + DAY)
    // and it does not repeat every minute
    await checkDueAutomations(NOW + 60_000)
    expect(byStatus(a.id, 'skipped')).toHaveLength(1)
  })

  it('ignores a paused automation', async () => {
    const a = await makeAutomation({ nextRunAt: NOW - 3 * DAY, enabled: false })
    expect(await checkDueAutomations(NOW)).toEqual([])
    expect(getRunsForAutomation(a.id)).toHaveLength(0)
  })

  it('records the run as failed, not missed, when the provider errors', async () => {
    provider.runAgent.mockRejectedValue(new Error('rate limited'))
    const a = await makeAutomation({ nextRunAt: NOW - 30_000 })
    await checkDueAutomations(NOW)
    expect(byStatus(a.id, 'failed')[0]).toMatchObject({
      error: 'rate limited',
      scheduledFor: NOW - 30_000,
    })
    expect(byStatus(a.id, 'missed')).toHaveLength(0)
  })
})

describe('overlapping ticks', () => {
  it('does not count or run the same windows twice while a catch-up is still going', async () => {
    let release
    provider.runAgent.mockImplementation(
      () =>
        new Promise((resolve) => {
          release = () => resolve({ content: 'late', tokens: 1, duration: 1 })
        })
    )
    const a = await makeAutomation({ nextRunAt: NOW - 3.5 * DAY })

    const first = checkDueAutomations(NOW)
    await Promise.resolve()
    const second = await checkDueAutomations(NOW + 60_000) // a minute later, first run still in progress
    expect(second).toEqual([])
    await vi.waitFor(() => expect(provider.runAgent).toHaveBeenCalled())
    release()
    await first

    expect(provider.runAgent).toHaveBeenCalledTimes(1)
    expect(byStatus(a.id, 'missed')).toHaveLength(1)
    expect(byStatus(a.id, 'missed')[0].missedCount).toBe(3)
  })
})

describe('settings', () => {
  it('stores a missed-run policy, and falls back to run_once for anything else', async () => {
    const withPolicy = await createAutomation({
      name: 'x',
      agentId: 'a',
      agentName: 'A',
      schedule: 'daily',
      missedPolicy: 'skip',
      apiKey: 'k',
    })
    const withoutPolicy = await createAutomation({
      name: 'y',
      agentId: 'a',
      agentName: 'A',
      schedule: 'daily',
      apiKey: 'k',
    })
    expect(withPolicy.missedPolicy).toBe('skip')
    expect(withoutPolicy.missedPolicy).toBe('run_once')

    const updated = await updateAutomation(withPolicy.id, { missedPolicy: 'catch_up' })
    expect(updated.missedPolicy).toBe('catch_up')
    expect((await updateAutomation(withPolicy.id, { missedPolicy: 'bogus' })).missedPolicy).toBe(
      'run_once'
    )
  })

  it('treats the time an automation was paused as paused, not missed', async () => {
    const a = await makeAutomation({ nextRunAt: NOW - 5 * DAY })
    await updateAutomation(a.id, { enabled: false })
    await toggleAutomation(a.id) // resume
    expect(getAutomation(a.id).nextRunAt).toBe(NOW + DAY)

    expect(await checkDueAutomations(NOW)).toEqual([])
    expect(getRunsForAutomation(a.id)).toHaveLength(0)
  })

  it('leaves a future next run alone when resuming', async () => {
    const a = await makeAutomation({ nextRunAt: NOW + 3 * HOUR })
    await updateAutomation(a.id, { enabled: false })
    await toggleAutomation(a.id)
    expect(getAutomation(a.id).nextRunAt).toBe(NOW + 3 * HOUR)
  })
})

describe('running by hand', () => {
  it('still restarts the schedule from when the run finished', async () => {
    const a = await makeAutomation({ nextRunAt: NOW + 5 * HOUR })
    const run = await runAutomationNow(a.id)
    expect(run.status).toBe('success')
    expect(run.scheduledFor).toBeUndefined()
    expect(getAutomation(a.id).nextRunAt).toBe(NOW + DAY)
  })
})
