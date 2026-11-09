import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getGlobalKeys } from './globalKeys'

const DEFAULT_PROVIDER_KEY = 'OpenAgents_default_provider'

describe('global key default provider fallback', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })
  afterEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('clears a preference that points at a provider without a live key', () => {
    localStorage.setItem(DEFAULT_PROVIDER_KEY, 'gemini')

    const keys = getGlobalKeys()

    expect(keys.defaultProvider).toBe('')
    expect(localStorage.getItem(DEFAULT_PROVIDER_KEY)).toBeNull()
  })

  it('clears an unknown provider preference', () => {
    localStorage.setItem(DEFAULT_PROVIDER_KEY, 'bogus')

    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(localStorage.getItem(DEFAULT_PROVIDER_KEY)).toBeNull()
  })
})
