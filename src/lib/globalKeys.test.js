import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearAllGlobalKeys,
  clearGlobalKey,
  getAvailableProviders,
  getGlobalKeys,
  saveGlobalKeys,
} from './globalKeys'

const SESSION_KEYS = {
  openai: 'OpenAgents_openai_key',
  anthropic: 'OpenAgents_anthropic_key',
  gemini: 'OpenAgents_gemini_key',
  openrouter: 'OpenAgents_openrouter_key',
}
const DEFAULT_PROVIDER_KEY = 'OpenAgents_default_provider'
const EXPIRY_MS = 8 * 60 * 60 * 1000

function readStoredSecret(provider) {
  return JSON.parse(sessionStorage.getItem(SESSION_KEYS[provider]))
}

describe('globalKeys', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T08:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stores a key with an expiry and ignores a default without a live key', () => {
    saveGlobalKeys({
      openai: '  sk-openai  ',
      anthropic: '',
      gemini: '   ',
      defaultProvider: ' anthropic ',
    })

    expect(getGlobalKeys()).toEqual({
      openai: 'sk-openai',
      anthropic: '',
      gemini: '',
      openrouter: '',
      defaultProvider: '',
    })
    expect(readStoredSecret('openai')).toEqual({
      key: 'sk-openai',
      expiresAt: Date.now() + EXPIRY_MS,
    })
    expect(localStorage.getItem(SESSION_KEYS.openai)).toBeNull()
    expect(localStorage.getItem(DEFAULT_PROVIDER_KEY)).toBeNull()
  })

  it('does not overwrite an existing key with an empty value', () => {
    saveGlobalKeys({ openai: 'first-key' })
    saveGlobalKeys({ openai: '' })

    expect(getGlobalKeys().openai).toBe('first-key')
  })

  it('removes a secret after its expiry has passed', () => {
    saveGlobalKeys({ gemini: 'gemini-key' })
    vi.advanceTimersByTime(EXPIRY_MS + 1)

    expect(getGlobalKeys().gemini).toBe('')
    expect(sessionStorage.getItem(SESSION_KEYS.gemini)).toBeNull()
  })

  it('migrates a legacy plaintext key out of local storage', () => {
    localStorage.setItem(SESSION_KEYS.anthropic, 'legacy-anthropic-key')

    const keys = getGlobalKeys()

    expect(keys.anthropic).toBe('legacy-anthropic-key')
    expect(localStorage.getItem(SESSION_KEYS.anthropic)).toBeNull()
    expect(readStoredSecret('anthropic').key).toBe('legacy-anthropic-key')
  })

  it('does not replace a newer session key with a legacy copy', () => {
    sessionStorage.setItem(
      SESSION_KEYS.openai,
      JSON.stringify({ key: 'current-key', expiresAt: Date.now() + EXPIRY_MS })
    )
    localStorage.setItem(SESSION_KEYS.openai, 'legacy-key')

    expect(getGlobalKeys().openai).toBe('current-key')
    expect(localStorage.getItem(SESSION_KEYS.openai)).toBeNull()
  })

  it('tolerates a plaintext session value left by an older build', () => {
    sessionStorage.setItem(SESSION_KEYS.openrouter, 'plain-session-key')

    expect(getGlobalKeys().openrouter).toBe('plain-session-key')
  })

  it('clears one provider without touching the others', () => {
    saveGlobalKeys({
      openai: 'openai-key',
      anthropic: 'anthropic-key',
      defaultProvider: 'openai',
    })

    clearGlobalKey('openai')

    expect(getGlobalKeys()).toEqual({
      openai: '',
      anthropic: 'anthropic-key',
      gemini: '',
      openrouter: '',
      defaultProvider: '',
    })
    expect(sessionStorage.getItem(SESSION_KEYS.openai)).toBeNull()
    expect(sessionStorage.getItem(SESSION_KEYS.anthropic)).not.toBeNull()
  })

  it('clears every managed key and the default preference', () => {
    saveGlobalKeys({
      openai: 'openai-key',
      anthropic: 'anthropic-key',
      gemini: 'gemini-key',
      openrouter: 'openrouter-key',
      defaultProvider: 'gemini',
    })

    clearAllGlobalKeys()

    expect(getGlobalKeys()).toEqual({
      openai: '',
      anthropic: '',
      gemini: '',
      openrouter: '',
      defaultProvider: '',
    })
    expect(localStorage.getItem(DEFAULT_PROVIDER_KEY)).toBeNull()
  })

  it('returns only saved providers in the documented order and labels', () => {
    saveGlobalKeys({ gemini: 'gemini-key', openai: 'openai-key' })

    expect(getAvailableProviders()).toEqual([
      { id: 'openai', label: 'OpenAI' },
      { id: 'gemini', label: 'Google Gemini' },
    ])
  })

  it('does not treat whitespace-only or expired keys as available providers', () => {
    saveGlobalKeys({ openai: 'openai-key' })
    sessionStorage.setItem(
      SESSION_KEYS.gemini,
      JSON.stringify({ key: '   ', expiresAt: Date.now() + EXPIRY_MS })
    )

    expect(getAvailableProviders()).toEqual([{ id: 'openai', label: 'OpenAI' }])
  })
})
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('saveGlobalKeys', () => {
  it('writes nothing when every field is blank and reports each skipped provider', () => {
    const outcome = saveGlobalKeys({
      openai: '',
      anthropic: '   ',
      gemini: '',
      openrouter: '',
    })

    expect(outcome.stored).toEqual([])
    expect(outcome.skipped).toEqual(['openai', 'anthropic', 'gemini', 'openrouter'])
    expect(getGlobalKeys()).toMatchObject({
      openai: '',
      anthropic: '',
      gemini: '',
      openrouter: '',
    })
  })

  it('stores only populated fields and keeps their ordering for the caller', () => {
    const outcome = saveGlobalKeys({
      openai: ' sk-openai ',
      anthropic: '',
      gemini: 'AIza-test',
      openrouter: '   ',
    })

    expect(outcome.stored).toEqual(['openai', 'gemini'])
    expect(outcome.skipped).toEqual(['anthropic', 'openrouter'])
    expect(getGlobalKeys()).toMatchObject({
      openai: 'sk-openai',
      anthropic: '',
      gemini: 'AIza-test',
      openrouter: '',
    })
  })

  it('clears the saved default when the empty option is selected', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })
    expect(getGlobalKeys().defaultProvider).toBe('openai')

    const outcome = saveGlobalKeys({ defaultProvider: '' })

    expect(outcome.defaultProvider).toBe('')
    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(localStorage.getItem('OpenAgents_default_provider')).toBeNull()
  })

  it('leaves the default untouched when the caller omits it', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })

    saveGlobalKeys({ gemini: 'AIza-test' })

    expect(getGlobalKeys().defaultProvider).toBe('openai')
  })
})

describe('getGlobalKeys', () => {
  it('drops a default that points at a provider with no live key', () => {
    localStorage.setItem('OpenAgents_default_provider', 'anthropic')

    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(localStorage.getItem('OpenAgents_default_provider')).toBeNull()
  })

  it('returns the stored default while its key exists', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })

    expect(getGlobalKeys().defaultProvider).toBe('openai')
  })
})

describe('clearGlobalKey', () => {
  it('removes the key and a default that depended on it', () => {
    saveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })

    clearGlobalKey('openai')

    expect(getGlobalKeys().openai).toBe('')
    expect(getGlobalKeys().defaultProvider).toBe('')
  })

  it('removes the default directly when asked', () => {
    saveGlobalKeys({ gemini: 'AIza-test', defaultProvider: 'gemini' })

    clearGlobalKey('defaultProvider')

    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(getGlobalKeys().gemini).toBe('AIza-test')
  })

  it('clears every managed key and the default', () => {
    saveGlobalKeys({
      openai: 'sk-openai',
      anthropic: 'sk-ant-test',
      defaultProvider: 'openai',
    })

    clearAllGlobalKeys()

    expect(getGlobalKeys()).toEqual({
      openai: '',
      anthropic: '',
      gemini: '',
      openrouter: '',
      defaultProvider: '',
    })
  })
})
