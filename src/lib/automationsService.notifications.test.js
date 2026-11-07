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

import { createAutomation, getEmailLogs, runAutomationNow } from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)

class MockNotification {
  static permission = 'granted'
  static instances = []

  constructor(title, options) {
    MockNotification.instances.push({ title, options })
  }
}

async function makeJob() {
  return createAutomation({
    name: 'Nightly report',
    agentId: '4',
    agentName: 'Reporting Agent',
    apiKey: 'sk-notify',
    emailNotification: true,
    notificationEmail: 'owner@example.com',
  })
}

describe('run completion notifications', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', webcrypto)
  })

  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    localStorage.setItem('oa_automation_runs_v2', '[]')
    vi.stubGlobal('crypto', webcrypto)
    keyStoreState.key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
    provider.runAgent.mockReset()
    MockNotification.permission = 'granted'
    MockNotification.instances = []
    vi.stubGlobal('Notification', MockNotification)
    vi.stubEnv('VITE_RESEND_API_KEY', 're_notify_key')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('emails a successful report and raises a completion notification', async () => {
    provider.runAgent.mockResolvedValue({ content: 'All clear', tokens: 9, duration: 3 })
    const job = await makeJob()

    const run = await runAutomationNow(job.id)

    expect(run).toMatchObject({ status: 'success', emailSent: true, output: 'All clear' })
    expect(getEmailLogs()).toEqual([
      expect.objectContaining({
        to: 'owner@example.com',
        status: 'Delivered',
        subject: '[Open Agents Hub] Completed: Nightly report',
        preview: 'All clear...',
      }),
    ])
    expect(MockNotification.instances).toEqual([
      {
        title: 'Nightly report Finished',
        options: { body: 'Output generated in 0.0s', icon: '/favicon.ico' },
      },
    ])
  })

  it('emails the failure reason and raises a failure notification', async () => {
    provider.runAgent.mockRejectedValue(new Error('provider exploded'))
    const job = await makeJob()

    const run = await runAutomationNow(job.id)

    expect(run).toMatchObject({
      status: 'failed',
      emailSent: true,
      error: 'provider exploded',
      output: '',
    })
    expect(getEmailLogs()[0]).toMatchObject({
      status: 'Failed',
      subject: '[Open Agents Hub] Failed: Nightly report',
      preview: 'provider exploded',
    })
    expect(MockNotification.instances).toEqual([
      {
        title: 'Nightly report Failed',
        options: { body: 'provider exploded', icon: '/favicon.ico' },
      },
    ])
  })

  it('does not notify when the browser permission is denied', async () => {
    MockNotification.permission = 'denied'
    provider.runAgent.mockResolvedValue({ content: 'quiet', tokens: 1, duration: 1 })
    const job = await makeJob()

    const run = await runAutomationNow(job.id)

    expect(run.status).toBe('success')
    expect(MockNotification.instances).toEqual([])
    expect(getEmailLogs()).toHaveLength(1)
  })
})
