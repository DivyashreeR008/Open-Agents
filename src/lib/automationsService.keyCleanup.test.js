// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null }))
const db = vi.hoisted(() => {
  const state = { calls: [], error: null, failDelete: false }
  const query = {
    delete: () => {
      state.calls.push(['delete'])
      if (state.failDelete) throw new Error('server offline')
      return query
    },
    eq: (column, value) => {
      state.calls.push(['eq', column, value])
      return query
    },
    then: (resolve, reject) => Promise.resolve({ error: state.error }).then(resolve, reject),
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
  clearAutomationKeys,
  removeAutomationKey,
  retrieveAutomationKey,
  storeAutomationKey,
} from './automationsService'

const AUTOMATIONS_KEY = 'oa_automations_v2'
const VAULT_KEY = 'oa_encrypted_vault_v2'

describe('legacy server credential cleanup', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', webcrypto)
  })

  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem(
      AUTOMATIONS_KEY,
      JSON.stringify([{ id: 'job-1', provider: 'openai', hasKey: true }])
    )
    db.state.calls = []
    db.state.error = null
    db.state.failDelete = false
    keyStoreState.key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
    vi.restoreAllMocks()
  })

  it('removes the uploaded copy when a new device-bound key is stored', async () => {
    await storeAutomationKey('job-1', 'sk-device-bound')

    expect(db.state.calls).toEqual([
      ['from', 'user_secrets'],
      ['delete'],
      ['eq', 'automation_id', 'job-1'],
    ])
    await expect(retrieveAutomationKey('job-1')).resolves.toBe('sk-device-bound')
  })

  it('still saves the local key when the legacy cleanup fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    db.state.failDelete = true

    await storeAutomationKey('job-1', 'sk-local-only')

    expect(warn).toHaveBeenCalledWith('Legacy server key cleanup failed:', expect.any(Error))
    await expect(retrieveAutomationKey('job-1')).resolves.toBe('sk-local-only')
  })

  it('queues a server delete when one local key is removed', async () => {
    await storeAutomationKey('job-1', 'sk-remove-me')
    db.state.calls = []

    removeAutomationKey('job-1')

    expect(db.state.calls).toEqual([
      ['from', 'user_secrets'],
      ['delete'],
      ['eq', 'automation_id', 'job-1'],
    ])
    expect(JSON.parse(localStorage.getItem(VAULT_KEY))).toEqual({})
  })

  it('clears local credentials even when the server rejects the bulk delete', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await storeAutomationKey('job-1', 'sk-bulk')
    db.state.error = { message: 'permission denied' }

    await expect(clearAutomationKeys()).resolves.toBe(1)

    expect(warn).toHaveBeenCalledWith(
      'Supabase automation key clear failed:',
      expect.objectContaining({ message: 'permission denied' })
    )
    expect(JSON.parse(localStorage.getItem(VAULT_KEY))).toEqual({})
    expect(JSON.parse(localStorage.getItem(AUTOMATIONS_KEY))[0].hasKey).toBe(false)
  })
})
