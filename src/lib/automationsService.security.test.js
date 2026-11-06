// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null, error: null }))

vi.mock('./automationKeyStore', () => {
  class CredentialProtectionError extends Error {
    constructor(code, message, cause) {
      super(message, cause ? { cause } : undefined)
      this.name = 'CredentialProtectionError'
      this.code = code
    }
  }
  return {
    CredentialProtectionError,
    getOrCreateDeviceKey: async () => {
      if (keyStoreState.error) throw keyStoreState.error
      return keyStoreState.key
    },
  }
})

import {
  decryptSecret,
  encryptSecret,
  retrieveAutomationKey,
  storeAutomationKey,
} from './automationsService'

const VAULT_KEY = 'oa_encrypted_vault_v2'
const SECRET = 'sk-automation-policy-secret'

beforeAll(() => {
  vi.stubGlobal('crypto', webcrypto)
})

beforeEach(async () => {
  localStorage.clear()
  keyStoreState.error = null
  keyStoreState.key = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
})

describe('automation credential protection', () => {
  it('round-trips v2 ciphertext with a non-extractable device key', async () => {
    const encrypted = await encryptSecret(SECRET)

    expect(keyStoreState.key.extractable).toBe(false)
    expect(encrypted).toMatch(/^v2:/)
    await expect(decryptSecret(encrypted)).resolves.toBe(SECRET)
  })

  it('uses a fresh IV and never exposes plaintext or its base64 encoding', async () => {
    const first = await encryptSecret(SECRET)
    const second = await encryptSecret(SECRET)

    expect(first).not.toBe(second)
    expect(first).not.toContain(SECRET)
    expect(first).not.toContain(btoa(SECRET))
  })

  it('refuses to persist when device protection is unavailable', async () => {
    keyStoreState.error = new Error('IndexedDB blocked')

    await expect(storeAutomationKey('blocked-job', SECRET)).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'ENCRYPTION_FAILED',
    })
    expect(localStorage.getItem(VAULT_KEY)).toBeNull()
  })

  it('throws a typed error for corrupt ciphertext instead of returning garbage', async () => {
    await expect(decryptSecret('v2:AAAA')).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'DECRYPTION_FAILED',
    })
  })

  it('migrates authenticated legacy AES-GCM values to v2 on first read', async () => {
    const legacy = await encryptLegacy(SECRET)
    localStorage.setItem(VAULT_KEY, JSON.stringify({ legacy_job: legacy }))

    await expect(retrieveAutomationKey('legacy_job')).resolves.toBe(SECRET)
    const migrated = JSON.parse(localStorage.getItem(VAULT_KEY)).legacy_job
    expect(migrated).toMatch(/^v2:/)
    await expect(decryptSecret(migrated)).resolves.toBe(SECRET)
  })

  it('requires re-entry for a legacy reversible base64 value', async () => {
    localStorage.setItem(VAULT_KEY, JSON.stringify({ legacy_job: btoa(SECRET) }))

    await expect(retrieveAutomationKey('legacy_job')).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'LEGACY_KEY_REENTRY_REQUIRED',
    })
    expect(JSON.parse(localStorage.getItem(VAULT_KEY)).legacy_job).toBe(btoa(SECRET))
  })
})

async function encryptLegacy(plainText) {
  const encoder = new TextEncoder()
  const material = await webcrypto.subtle.importKey(
    'raw',
    encoder.encode('ila-pgsodium-salt-2026'),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  const key = await webcrypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('salt-val-pgsodium'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )
  const iv = webcrypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plainText)
  )
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)
  return btoa(String.fromCharCode(...combined))
}
