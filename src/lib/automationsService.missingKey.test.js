// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null }))
const provider = vi.hoisted(() => ({ runAgent: vi.fn() }))
const analytics = vi.hoisted(() => ({ recordAnalyticsRun: vi.fn() }))

vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: async () => keyStoreState.key,
}))
vi.mock('./llmAdapter', () => ({ runAgent: provider.runAgent }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: analytics.recordAnalyticsRun }))
vi.mock('./supabase', () => ({ supabase: {}, isSupabaseConfigured: false }))

import {
  createAutomation,
  getAutomation,
  getRunsForAutomation,
  runAutomationNow,
} from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)
const DAY = 24 * 60 * 60 * 1000

async function makeJob(overrides = {}) {
  return createAutomation({
    name: 'Manual run',
    agentId: '1',
    agentName: 'Agent',
    schedule: 'daily',
    ...overrides,
  })
}

describe('running an automation without usable credentials', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', webcrypto)
  })

  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    localStorage.setItem('oa_automation_runs_v2', '[]')
    keyStoreState.key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
    provider.runAgent.mockReset()
    analytics.recordAnalyticsRun.mockReset()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('records a failed run when the automation has no stored key', async () => {
    const job = await makeJob()

    const run = await runAutomationNow(job.id)

    expect(provider.runAgent).not.toHaveBeenCalled()
    expect(run).toMatchObject({
      automationId: job.id,
      status: 'failed',
      startedAt: NOW,
      completedAt: NOW,
      duration: 0,
      tokens: 0,
      output: '',
      emailSent: false,
      error: 'Encrypted API Key is missing. Please edit this automation and re-enter your API key.',
    })
    expect(getRunsForAutomation(job.id)).toEqual([run])
    expect(getAutomation(job.id)).toMatchObject({ lastRunAt: NOW, nextRunAt: NOW + DAY })
    expect(analytics.recordAnalyticsRun).not.toHaveBeenCalled()
  })

  it('rejects a run for an automation that does not exist', async () => {
    await expect(runAutomationNow('missing')).rejects.toThrow('Automation not found')
  })

  it('refuses to start the same automation twice while it is executing', async () => {
    const job = await makeJob({ apiKey: 'sk-live' })
    let finish
    provider.runAgent.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({ content: 'done', tokens: 3, duration: 12 })
        })
    )

    const first = runAutomationNow(job.id)
    await vi.waitFor(() => expect(provider.runAgent).toHaveBeenCalledTimes(1))

    await expect(runAutomationNow(job.id)).rejects.toThrow('This automation is currently executing')

    finish()
    await expect(first).resolves.toMatchObject({ status: 'success', tokens: 3 })
    expect(getRunsForAutomation(job.id)).toHaveLength(1)
  })
})
