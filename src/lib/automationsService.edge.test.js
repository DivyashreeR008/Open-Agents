import { webcrypto } from 'node:crypto'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null }))

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
    getOrCreateDeviceKey: async () => keyStoreState.key,
  }
})

import {
  decryptSecret,
  encryptSecret,
  removeAutomationKey,
  retrieveAutomationKey,
  storeAutomationKey,
} from './automationsService'

beforeAll(() => {
  vi.stubGlobal('crypto', webcrypto)
})

beforeEach(async () => {
  localStorage.clear()
  keyStoreState.key = await webcrypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
})

afterEach(() => {
  localStorage.clear()
})

describe('automation credential edge cases', () => {
  it('returns an empty string for empty input and rejects an unsupported ciphertext format', async () => {
    await expect(encryptSecret('')).resolves.toBe('')
    await expect(decryptSecret('')).resolves.toBe('')
    await expect(decryptSecret('legacy-ciphertext')).rejects.toMatchObject({
      code: 'UNSUPPORTED_CIPHERTEXT',
    })
  })

  it('round trips a secret and fails safely after the device key changes', async () => {
    const encrypted = await encryptSecret('sk-test-key with spaces')
    await expect(decryptSecret(encrypted)).resolves.toBe('sk-test-key with spaces')

    keyStoreState.key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
    await expect(decryptSecret(encrypted)).rejects.toMatchObject({
      code: 'DECRYPTION_FAILED',
    })
  })

  it('stores only encrypted key material and clears one vault entry', async () => {
    await storeAutomationKey('auto-edge', 'secret-plaintext')
    const stored = localStorage.getItem('oa_encrypted_vault_v2')

    expect(stored).not.toContain('secret-plaintext')
    await expect(retrieveAutomationKey('auto-edge')).resolves.toBe('secret-plaintext')

    removeAutomationKey('auto-edge')
    await expect(retrieveAutomationKey('auto-edge')).resolves.toBe('')
  })
})
