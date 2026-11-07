// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null }))

vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: async () => keyStoreState.key,
}))
vi.mock('./supabase', () => ({ supabase: {}, isSupabaseConfigured: false }))

import {
  createAutomation,
  loadAutomations,
  retrieveAutomationKey,
  updateAutomation,
} from './automationsService'

const VAULT_KEY = 'oa_encrypted_vault_v2'

function baseAutomation(overrides = {}) {
  return {
    name: 'Rotating key job',
    agentId: '1',
    agentName: 'Agent One',
    ...overrides,
  }
}

describe('automation API key rotation', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', webcrypto)
  })

  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    keyStoreState.key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
  })

  it('encrypts a key added after creation and reports that one is stored', async () => {
    const created = await createAutomation(baseAutomation())
    expect(created.hasKey).toBe(false)

    const updated = await updateAutomation(created.id, { apiKey: 'sk-first-key' })

    expect(updated.hasKey).toBe(true)
    expect(updated.apiKey).toBeUndefined()
    await expect(retrieveAutomationKey(created.id)).resolves.toBe('sk-first-key')

    const stored = localStorage.getItem('oa_automations_v2')
    expect(stored).not.toContain('sk-first-key')
    expect(JSON.parse(stored)[0].apiKey).toBeUndefined()
  })

  it('replaces an existing key without keeping the previous secret', async () => {
    const created = await createAutomation(baseAutomation({ apiKey: 'sk-old-key' }))
    expect(created.hasKey).toBe(true)

    await updateAutomation(created.id, { apiKey: 'sk-new-key' })

    await expect(retrieveAutomationKey(created.id)).resolves.toBe('sk-new-key')
    const vault = localStorage.getItem(VAULT_KEY)
    expect(vault).not.toContain('sk-old-key')
    expect(vault).not.toContain('sk-new-key')
    expect(Object.keys(JSON.parse(vault))).toEqual([created.id])
  })

  it('rejects an update for an automation that no longer exists', async () => {
    await expect(updateAutomation('missing-id', { name: 'x' })).rejects.toThrow(
      'Automation not found'
    )
    expect(loadAutomations()).toEqual([])
  })
})
