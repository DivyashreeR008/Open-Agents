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

  it('trims and stores keys only in session storage with an eight-hour expiry', () => {
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
      defaultProvider: 'anthropic',
    })
    expect(readStoredSecret('openai')).toEqual({
      key: 'sk-openai',
      expiresAt: Date.now() + EXPIRY_MS,
    })
    expect(localStorage.getItem(SESSION_KEYS.openai)).toBeNull()
    expect(localStorage.getItem(DEFAULT_PROVIDER_KEY)).toBe('anthropic')
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
      defaultProvider: 'openai',
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
