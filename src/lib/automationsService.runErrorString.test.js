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

import { createAutomation, runAutomationNow } from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)

beforeAll(() => {
  vi.stubGlobal('crypto', webcrypto)
})

beforeEach(async () => {
  localStorage.clear()
  localStorage.setItem('oa_automations_v2', '[]')
  localStorage.setItem('oa_automation_runs_v2', '[]')
  keyStoreState.key = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
  provider.runAgent.mockReset()
  analytics.recordAnalyticsRun.mockReset()
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
  localStorage.clear()
})

async function makeJob() {
  return createAutomation({
    name: 'Error shape',
    agentId: '1',
    agentName: 'Agent',
    apiKey: 'sk-test',
    schedule: 'daily',
  })
}

describe('run error normalization', () => {
  it('uses a thrown string as the recorded error', async () => {
    const job = await makeJob()
    provider.runAgent.mockRejectedValue('plain failure')

    const run = await runAutomationNow(job.id)

    expect(run).toMatchObject({ status: 'failed', error: 'plain failure' })
  })

  it('uses the execution fallback when the thrown object has no message', async () => {
    const job = await makeJob()
    provider.runAgent.mockRejectedValue({ code: 'UNKNOWN' })

    const run = await runAutomationNow(job.id)

    expect(run).toMatchObject({ status: 'failed', error: 'Execution error' })
  })
})
