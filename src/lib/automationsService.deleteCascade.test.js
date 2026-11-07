// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null }))
const db = vi.hoisted(() => {
  const state = { calls: [] }
  const query = {
    insert: (payload) => {
      state.calls.push(['insert', payload])
      return query
    },
    delete: () => {
      state.calls.push(['delete'])
      return query
    },
    eq: (column, value) => {
      state.calls.push(['eq', column, value])
      return query
    },
    then: (resolve, reject) => Promise.resolve({ error: null }).then(resolve, reject),
  }
  return {
    state,
    query,
    supabase: {
      from: (table) => {
        state.calls.push(['from', table])
        return query
      },
    },
  }
})

vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: async () => keyStoreState.key,
}))
vi.mock('./supabase', () => ({ supabase: db.supabase, isSupabaseConfigured: true }))

import {
  createAutomation,
  deleteAutomation,
  deleteRun,
  loadAutomations,
  loadRuns,
  retrieveAutomationKey,
} from './automationsService'

const RUNS_KEY = 'oa_automation_runs_v2'
const VAULT_KEY = 'oa_encrypted_vault_v2'

const hasCall = (expected) => db.state.calls.some((call) => call.join('|') === expected.join('|'))

describe('automation deletion cascade', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', webcrypto)
  })

  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    db.state.calls = []
    keyStoreState.key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  })

  it('removes the job, its history, its key, and the matching backend rows', async () => {
    const job = await createAutomation({
      name: 'Delete me',
      agentId: '1',
      agentName: 'Agent',
      apiKey: 'sk-delete-me',
    })
    localStorage.setItem(
      RUNS_KEY,
      JSON.stringify([
        { id: 'run-1', automationId: job.id },
        { id: 'run-2', automationId: 'other-job' },
      ])
    )
    db.state.calls = []

    await expect(deleteAutomation(job.id)).resolves.toBe(true)

    expect(loadAutomations()).toEqual([])
    expect(loadRuns()).toEqual([{ id: 'run-2', automationId: 'other-job' }])
    expect(JSON.parse(localStorage.getItem(VAULT_KEY))).toEqual({})
    await expect(retrieveAutomationKey(job.id)).resolves.toBe('')

    expect(hasCall(['from', 'user_secrets'])).toBe(true)
    expect(hasCall(['eq', 'automation_id', job.id])).toBe(true)
    expect(hasCall(['from', 'automations'])).toBe(true)
    expect(hasCall(['eq', 'id', job.id])).toBe(true)
    expect(hasCall(['from', 'automation_runs'])).toBe(true)
  })

  it('deletes a single run from history and from the backend', () => {
    localStorage.setItem(
      RUNS_KEY,
      JSON.stringify([
        { id: 'run-a', automationId: 'job' },
        { id: 'run-b', automationId: 'job' },
      ])
    )
    db.state.calls = []

    deleteRun('run-a')

    expect(loadRuns()).toEqual([{ id: 'run-b', automationId: 'job' }])
    expect(hasCall(['from', 'automation_runs'])).toBe(true)
    expect(hasCall(['eq', 'id', 'run-a'])).toBe(true)
  })

  it('treats a repeated delete as a no-op', async () => {
    await expect(deleteAutomation('already-gone')).resolves.toBe(true)
    expect(loadAutomations()).toEqual([])
  })
})
