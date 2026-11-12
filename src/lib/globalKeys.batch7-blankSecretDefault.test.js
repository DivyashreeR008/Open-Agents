import { beforeEach, describe, expect, it } from 'vitest'
import { getGlobalKeys } from './globalKeys'

const OPENAI_KEY = 'OpenAgents_openai_key'
const DEFAULT_KEY = 'OpenAgents_default_provider'
const EXPIRY_MS = 8 * 60 * 60 * 1000

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('default provider with a blank stored secret', () => {
  it('drops a default that points at a whitespace-only session key', () => {
    sessionStorage.setItem(
      OPENAI_KEY,
      JSON.stringify({ key: '   ', expiresAt: Date.now() + EXPIRY_MS })
    )
    localStorage.setItem(DEFAULT_KEY, 'openai')

    expect(getGlobalKeys()).toMatchObject({ openai: '   ', defaultProvider: '' })
    expect(localStorage.getItem(DEFAULT_KEY)).toBeNull()
  })

  it('keeps a default while its provider has a usable key', () => {
    sessionStorage.setItem(
      OPENAI_KEY,
      JSON.stringify({ key: 'sk-live', expiresAt: Date.now() + EXPIRY_MS })
    )
    localStorage.setItem(DEFAULT_KEY, 'openai')

    expect(getGlobalKeys()).toMatchObject({ openai: 'sk-live', defaultProvider: 'openai' })
  })
})
