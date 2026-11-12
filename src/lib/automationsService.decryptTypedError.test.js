// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'

const keyStore = vi.hoisted(() => ({ error: null }))

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
      throw keyStore.error
    },
  }
})

import { decryptSecret } from './automationsService'

beforeEach(() => {
  localStorage.clear()
})

describe('automation decryption typed failures', () => {
  it('rethrows a device-key protection error instead of reporting corrupt ciphertext', async () => {
    const { CredentialProtectionError } = await import('./automationKeyStore')
    keyStore.error = new CredentialProtectionError(
      'DEVICE_KEY_UNAVAILABLE',
      'Device key storage is blocked'
    )

    const payload = `v2:${btoa('0123456789abcdef0123')}`

    await expect(decryptSecret(payload)).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'DEVICE_KEY_UNAVAILABLE',
      message: 'Device key storage is blocked',
    })
  })
})
