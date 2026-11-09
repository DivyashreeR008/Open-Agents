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

import { encryptSecret } from './automationsService'

beforeEach(() => {
  localStorage.clear()
})

describe('automation encryption typed failures', () => {
  it('rethrows a credential protection error without wrapping it again', async () => {
    const { CredentialProtectionError } = await import('./automationKeyStore')
    keyStore.error = new CredentialProtectionError(
      'DEVICE_KEY_UNAVAILABLE',
      'Device key storage is blocked'
    )

    await expect(encryptSecret('sk-secret')).rejects.toMatchObject({
      name: 'CredentialProtectionError',
      code: 'DEVICE_KEY_UNAVAILABLE',
      message: 'Device key storage is blocked',
    })
  })
})
