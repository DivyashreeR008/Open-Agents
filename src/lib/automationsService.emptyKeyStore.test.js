// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: vi.fn(),
}))
vi.mock('./supabase', () => ({ supabase: {}, isSupabaseConfigured: false }))

import { storeAutomationKey } from './automationsService'

beforeEach(() => {
  localStorage.clear()
})

describe('automation empty key storage', () => {
  it('does not create a vault entry when the key is empty', async () => {
    await storeAutomationKey('empty-job', '')

    expect(localStorage.getItem('oa_encrypted_vault_v2')).toBeNull()
  })
})
