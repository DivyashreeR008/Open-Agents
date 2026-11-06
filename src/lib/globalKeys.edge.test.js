import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearAllGlobalKeys,
  clearGlobalKey,
  getAvailableProviders,
  getGlobalKeys,
  saveGlobalKeys,
} from './globalKeys'
import { simulateStorageDisabled } from '../test/storageFailures'

const SESSION_KEYS = {
  openai: 'OpenAgents_openai_key',
  anthropic: 'OpenAgents_anthropic_key',
}
const EXPIRY_MS = 8 * 60 * 60 * 1000

describe('globalKeys edge behavior', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T08:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('treats an empty stored key value as missing', () => {
    sessionStorage.setItem(
      SESSION_KEYS.openai,
      JSON.stringify({ key: '', expiresAt: Date.now() + EXPIRY_MS })
    )

    expect(getGlobalKeys().openai).toBe('')
    expect(getAvailableProviders()).toEqual([])
  })

  it('keeps an unrelated default when clearing another provider and ignores unknown ids', () => {
    saveGlobalKeys({
      openai: 'sk-openai',
      anthropic: 'sk-ant',
      defaultProvider: 'anthropic',
    })

    clearGlobalKey('unknown')
    expect(getGlobalKeys()).toMatchObject({
      openai: 'sk-openai',
      anthropic: 'sk-ant',
      defaultProvider: 'anthropic',
    })

    clearGlobalKey('openai')
    expect(getGlobalKeys()).toMatchObject({
      openai: '',
      anthropic: 'sk-ant',
      defaultProvider: 'anthropic',
    })
  })

  it('cleans up without throwing when storage is unavailable', () => {
    saveGlobalKeys({
      openai: 'sk-openai',
      anthropic: 'sk-ant',
      defaultProvider: 'openai',
    })

    simulateStorageDisabled()

    expect(() => clearGlobalKey('openai')).not.toThrow()
    expect(() => clearGlobalKey('defaultProvider')).not.toThrow()
    expect(() => clearAllGlobalKeys()).not.toThrow()
  })
})
