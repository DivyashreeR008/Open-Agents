// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const remote = vi.hoisted(() => {
  const calls = []
  const chain = () => {
    const builder = {
      insert: vi.fn(() => builder),
      update: vi.fn(() => builder),
      delete: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      then: (resolve, reject) =>
        Promise.reject(new Error('remote unavailable')).then(resolve, reject),
    }
    return builder
  }
  return { calls, chain }
})

vi.mock('./supabase', () => ({
  supabase: { from: vi.fn(() => remote.chain()) },
  isSupabaseConfigured: true,
}))
vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: async () => null,
}))
vi.mock('./llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))

import {
  createAutomation,
  deleteAutomation,
  loadAutomations,
  updateAutomation,
} from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('oa_automations_v2', '[]')
  localStorage.setItem('oa_automation_runs_v2', '[]')
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('remote sync failures do not break local automation CRUD', () => {
  it('keeps a created automation when the remote insert fails', async () => {
    const created = await createAutomation({
      name: 'Local first',
      agentId: '1',
      agentName: 'Agent',
    })

    expect(loadAutomations()).toEqual([created])
  })

  it('keeps an updated automation when the remote update fails', async () => {
    const created = await createAutomation({
      name: 'Local update',
      agentId: '1',
      agentName: 'Agent',
    })

    const updated = await updateAutomation(created.id, { name: 'Renamed locally' })

    expect(updated.name).toBe('Renamed locally')
    expect(loadAutomations()[0].name).toBe('Renamed locally')
  })

  it('removes an automation locally even when the remote delete fails', async () => {
    const created = await createAutomation({
      name: 'Local delete',
      agentId: '1',
      agentName: 'Agent',
    })

    await expect(deleteAutomation(created.id)).resolves.toBe(true)
    expect(loadAutomations()).toEqual([])
  })
})
