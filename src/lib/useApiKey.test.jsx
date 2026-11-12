import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { saveGlobalKeys } from './globalKeys'
import { useApiKey } from './useApiKey'

const STORAGE_PREFIX = 'oa_apikey_'
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000
const BASE_TIMESTAMP = 1_770_000_000_000 // Fixed deterministic epoch ms

/**
 * Controlled in-memory SessionStorage mock implementation with configurable failure modes
 * and operation tracking.
 */
class ControlledSessionStorage {
  constructor() {
    this._store = new Map()
    this.failGet = false
    this.failSet = false
    this.failRemove = false
    this.operations = []
  }

  getItem(key) {
    this.operations.push({ op: 'getItem', key })
    if (this.failGet) {
      throw new Error('ControlledSessionStorage: simulated getItem failure')
    }
    return this._store.has(key) ? this._store.get(key) : null
  }

  setItem(key, value) {
    this.operations.push({ op: 'setItem', key, value: String(value) })
    if (this.failSet) {
      throw new Error('ControlledSessionStorage: simulated setItem failure')
    }
    this._store.set(String(key), String(value))
  }

  removeItem(key) {
    this.operations.push({ op: 'removeItem', key })
    if (this.failRemove) {
      throw new Error('ControlledSessionStorage: simulated removeItem failure')
    }
    this._store.delete(String(key))
  }

  clear() {
    this.operations.push({ op: 'clear' })
    this._store.clear()
  }

  get length() {
    return this._store.size
  }

  key(index) {
    const keys = Array.from(this._store.keys())
    return keys[index] ?? null
  }

  peek(key) {
    return this._store.get(key) ?? null
  }

  seed(key, value) {
    this._store.set(String(key), String(value))
  }
}

describe('useApiKey persistence, expiry, and migration contract audit', () => {
  let controlledStorage
  let originalSessionStorage

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(BASE_TIMESTAMP)

    localStorage.clear()

    // Install controlled session storage mock
    controlledStorage = new ControlledSessionStorage()
    originalSessionStorage = window.sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: controlledStorage,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    localStorage.clear()

    if (originalSessionStorage) {
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage,
        configurable: true,
        writable: true,
      })
    }
  })

  describe('Session storage read and initialization', () => {
    it('leaves the key empty and the save option off when session entry is empty', () => {
      const { result } = renderHook(() => useApiKey())

      expect(result.current.apiKey).toBe('')
      expect(result.current.saveForSession).toBe(false)
      expect(result.current.provider).toBe('openai')
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()
    })

    it('restores the key and turns the save option on from a fresh wrapped entry', () => {
      const expiresAt = Date.now() + 60_000
      controlledStorage.seed(
        `${STORAGE_PREFIX}openai`,
        JSON.stringify({ key: 'sk-fresh-live-key', expiresAt })
      )

      const { result } = renderHook(() => useApiKey())

      expect(result.current.apiKey).toBe('sk-fresh-live-key')
      expect(result.current.saveForSession).toBe(true)

      // Storage assertion for wrapper shape
      const rawStored = controlledStorage.peek(`${STORAGE_PREFIX}openai`)
      expect(rawStored).not.toBeNull()
      const parsed = JSON.parse(rawStored)
      expect(parsed).toEqual({
        key: 'sk-fresh-live-key',
        expiresAt,
      })
      expect(typeof parsed.key).toBe('string')
      expect(typeof parsed.expiresAt).toBe('number')
    })

    it('removes an expired wrapped entry and does not restore the key', () => {
      controlledStorage.seed(
        `${STORAGE_PREFIX}openai`,
        JSON.stringify({ key: 'sk-expired-secret', expiresAt: Date.now() - 1000 })
      )

      const { result } = renderHook(() => useApiKey())

      expect(result.current.apiKey).toBe('')
      expect(result.current.saveForSession).toBe(false)
      // Storage assertion verifying removal
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()
    })

    it('respects expiry at the exact timestamp boundary', () => {
      const boundaryTimestamp = BASE_TIMESTAMP + 10_000

      // Case 1: Exactly at the boundary (Date.now() === expiresAt) -> NOT expired
      controlledStorage.seed(
        `${STORAGE_PREFIX}openai`,
        JSON.stringify({ key: 'sk-boundary-valid', expiresAt: boundaryTimestamp })
      )
      vi.setSystemTime(boundaryTimestamp)

      const { result: validResult } = renderHook(() => useApiKey())
      expect(validResult.current.apiKey).toBe('sk-boundary-valid')
      expect(validResult.current.saveForSession).toBe(true)
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).not.toBeNull()

      // Case 2: 1ms past the boundary (Date.now() === expiresAt + 1) -> EXPIRED
      controlledStorage.clear()
      controlledStorage.seed(
        `${STORAGE_PREFIX}openai`,
        JSON.stringify({ key: 'sk-boundary-expired', expiresAt: boundaryTimestamp })
      )
      vi.setSystemTime(boundaryTimestamp + 1)

      const { result: expiredResult } = renderHook(() => useApiKey())
      expect(expiredResult.current.apiKey).toBe('')
      expect(expiredResult.current.saveForSession).toBe(false)
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()
    })

    it('returns a legacy plaintext entry as-is without treating it as a wrapped record', () => {
      // Legacy plaintext value that cannot be parsed as a JSON record
      const legacyKey = 'sk-legacy-raw-plaintext-token'
      controlledStorage.seed(`${STORAGE_PREFIX}openai`, legacyKey)

      const { result } = renderHook(() => useApiKey())

      expect(result.current.apiKey).toBe(legacyKey)
      expect(result.current.saveForSession).toBe(true)
      // Storage still preserves the raw string unchanged on read
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBe(legacyKey)
    })

    it('migrates a legacy plaintext entry to a wrapped shape upon subsequent key update', () => {
      const legacyKey = 'sk-legacy-unmigrated-token'
      controlledStorage.seed(`${STORAGE_PREFIX}openai`, legacyKey)

      const { result } = renderHook(() => useApiKey())
      expect(result.current.apiKey).toBe(legacyKey)
      expect(result.current.saveForSession).toBe(true)

      // When the user updates or rotates the key, it is migrated into the modern wrapped shape
      act(() => {
        result.current.setApiKey('sk-upgraded-modern-token')
      })

      expect(result.current.apiKey).toBe('sk-upgraded-modern-token')
      const stored = JSON.parse(controlledStorage.peek(`${STORAGE_PREFIX}openai`))
      expect(stored).toEqual({
        key: 'sk-upgraded-modern-token',
        expiresAt: BASE_TIMESTAMP + EIGHT_HOURS_MS,
      })
    })

    it('uses a global key only when no session key exists and leaves save option off', () => {
      saveGlobalKeys({ openai: 'sk-global-configured-key' })

      const { result } = renderHook(() => useApiKey())

      expect(result.current.apiKey).toBe('sk-global-configured-key')
      expect(result.current.saveForSession).toBe(false)
      // Must not automatically write to session storage for global keys
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()
    })

    it('prefers a session key over an existing global key and sets save option on', () => {
      saveGlobalKeys({ openai: 'sk-global-secret' })
      controlledStorage.seed(
        `${STORAGE_PREFIX}openai`,
        JSON.stringify({ key: 'sk-session-secret', expiresAt: Date.now() + 50_000 })
      )

      const { result } = renderHook(() => useApiKey())

      expect(result.current.apiKey).toBe('sk-session-secret')
      expect(result.current.saveForSession).toBe(true)
    })
  })

  describe('Provider switching behavior', () => {
    it('reloads the correct session, global, or empty value when switching providers', () => {
      // Setup:
      // openai -> fresh session key
      // anthropic -> global key only
      // gemini -> no session key and no global key
      controlledStorage.seed(
        `${STORAGE_PREFIX}openai`,
        JSON.stringify({ key: 'sk-openai-session', expiresAt: Date.now() + 10_000 })
      )
      saveGlobalKeys({ anthropic: 'sk-anthropic-global' })

      const { result } = renderHook(() => useApiKey())

      // 1. Initial provider is openai
      expect(result.current.provider).toBe('openai')
      expect(result.current.apiKey).toBe('sk-openai-session')
      expect(result.current.saveForSession).toBe(true)

      // 2. Switch to anthropic (global fallback)
      act(() => {
        result.current.setProvider('anthropic')
      })
      expect(result.current.provider).toBe('anthropic')
      expect(result.current.apiKey).toBe('sk-anthropic-global')
      expect(result.current.saveForSession).toBe(false)

      // 3. Switch to gemini (empty fallback)
      act(() => {
        result.current.setProvider('gemini')
      })
      expect(result.current.provider).toBe('gemini')
      expect(result.current.apiKey).toBe('')
      expect(result.current.saveForSession).toBe(false)

      // 4. Switch back to openai (restores session key)
      act(() => {
        result.current.setProvider('openai')
      })
      expect(result.current.provider).toBe('openai')
      expect(result.current.apiKey).toBe('sk-openai-session')
      expect(result.current.saveForSession).toBe(true)
    })

    it('does not copy the old key to the new provider after enabling save', () => {
      const { result } = renderHook(() => useApiKey())

      // Set key and enable save on openai
      act(() => {
        result.current.setApiKey('sk-openai-secret')
      })
      act(() => {
        result.current.setSaveForSession(true)
      })

      expect(result.current.apiKey).toBe('sk-openai-secret')
      expect(result.current.saveForSession).toBe(true)
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).not.toBeNull()

      // Switch to anthropic
      act(() => {
        result.current.setProvider('anthropic')
      })

      // Must be empty for anthropic, not copied from openai
      expect(result.current.provider).toBe('anthropic')
      expect(result.current.apiKey).toBe('')
      expect(result.current.saveForSession).toBe(false)
      expect(controlledStorage.peek(`${STORAGE_PREFIX}anthropic`)).toBeNull()

      // Original openai key must remain intact in storage
      const openaiRecord = JSON.parse(controlledStorage.peek(`${STORAGE_PREFIX}openai`))
      expect(openaiRecord.key).toBe('sk-openai-secret')
    })
  })

  describe('Key updating and save option persistence', () => {
    it('writes a wrapped entry only when save is enabled, and clearing the key removes it', () => {
      const { result } = renderHook(() => useApiKey())

      // With save disabled, setting a key does not write to session storage
      act(() => {
        result.current.setApiKey('sk-draft-unsaved')
      })
      expect(result.current.apiKey).toBe('sk-draft-unsaved')
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()

      // Enable save
      act(() => {
        result.current.setSaveForSession(true)
      })
      // Stored with wrapped shape
      let stored = JSON.parse(controlledStorage.peek(`${STORAGE_PREFIX}openai`))
      expect(stored).toEqual({
        key: 'sk-draft-unsaved',
        expiresAt: BASE_TIMESTAMP + EIGHT_HOURS_MS,
      })

      // Update key while save is enabled
      act(() => {
        result.current.setApiKey('sk-updated-saved')
      })
      stored = JSON.parse(controlledStorage.peek(`${STORAGE_PREFIX}openai`))
      expect(stored.key).toBe('sk-updated-saved')

      // Clearing key removes it from storage
      act(() => {
        result.current.setApiKey('')
      })
      expect(result.current.apiKey).toBe('')
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()
    })

    it('writes an entry when toggling save on with a value, and removes it when toggling off', () => {
      const { result } = renderHook(() => useApiKey())

      act(() => {
        result.current.setApiKey('sk-toggle-value')
      })
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()

      // Toggle save on
      act(() => {
        result.current.setSaveForSession(true)
      })
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).not.toBeNull()
      const stored = JSON.parse(controlledStorage.peek(`${STORAGE_PREFIX}openai`))
      expect(stored.key).toBe('sk-toggle-value')

      // Toggle save off
      act(() => {
        result.current.setSaveForSession(false)
      })
      expect(result.current.apiKey).toBe('sk-toggle-value')
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()

      // Toggling save on with an empty key does not write an entry
      act(() => {
        result.current.setApiKey('')
      })
      act(() => {
        result.current.setSaveForSession(true)
      })
      expect(controlledStorage.peek(`${STORAGE_PREFIX}openai`)).toBeNull()
    })

    it('sets the wrapper expiry to approximately eight hours from the write time', () => {
      const { result } = renderHook(() => useApiKey())

      act(() => {
        result.current.setSaveForSession(true)
      })
      act(() => {
        result.current.setApiKey('sk-eight-hour-audit')
      })

      const raw = controlledStorage.peek(`${STORAGE_PREFIX}openai`)
      expect(raw).not.toBeNull()
      const parsed = JSON.parse(raw)

      expect(parsed).toMatchObject({
        key: 'sk-eight-hour-audit',
        expiresAt: expect.any(Number),
      })

      const expectedExpiry = BASE_TIMESTAMP + 8 * 60 * 60 * 1000
      expect(parsed.expiresAt).toBe(expectedExpiry)
      expect(parsed.expiresAt - BASE_TIMESTAMP).toBe(28_800_000)
    })
  })

  describe('Storage exceptions resilience', () => {
    it('does not crash when session storage getItem throws', () => {
      controlledStorage.failGet = true

      let hookResult
      expect(() => {
        hookResult = renderHook(() => useApiKey())
      }).not.toThrow()

      expect(hookResult.result.current.apiKey).toBe('')
      expect(hookResult.result.current.saveForSession).toBe(false)
    })

    it('does not crash and retains in-memory state when session storage setItem throws', () => {
      const { result } = renderHook(() => useApiKey())

      controlledStorage.failSet = true

      expect(() => {
        act(() => {
          result.current.setSaveForSession(true)
        })
        act(() => {
          result.current.setApiKey('sk-in-memory-only')
        })
      }).not.toThrow()

      expect(result.current.apiKey).toBe('sk-in-memory-only')
      expect(result.current.saveForSession).toBe(true)
    })

    it('does not crash when session storage removeItem throws during purge or clear', () => {
      // Seed an expired key
      controlledStorage.seed(
        `${STORAGE_PREFIX}openai`,
        JSON.stringify({ key: 'sk-expired', expiresAt: Date.now() - 5000 })
      )
      controlledStorage.failRemove = true

      let hookResult
      expect(() => {
        hookResult = renderHook(() => useApiKey())
      }).not.toThrow()

      // The expired key should still be rejected, not returned as raw
      expect(hookResult.result.current.apiKey).toBe('')
      expect(hookResult.result.current.saveForSession).toBe(false)

      // Clearing key with failing removeItem also should not crash
      expect(() => {
        act(() => {
          hookResult.result.current.setApiKey('')
        })
      }).not.toThrow()
      expect(hookResult.result.current.apiKey).toBe('')
    })
  })

  describe('Callback identity and stability', () => {
    it('maintains stable callback references until documented dependencies change', () => {
      const { result, rerender } = renderHook(() => useApiKey())

      const initialSetProvider = result.current.setProvider
      const initialSetApiKey = result.current.setApiKey
      const initialSetSaveForSession = result.current.setSaveForSession

      // Re-render without state changes preserves all callback references
      rerender()
      expect(result.current.setProvider).toBe(initialSetProvider)
      expect(result.current.setApiKey).toBe(initialSetApiKey)
      expect(result.current.setSaveForSession).toBe(initialSetSaveForSession)

      // Updating apiKey (when save is off) does NOT change setApiKey
      // because setApiKey only depends on [provider, saveForSession]
      act(() => {
        result.current.setApiKey('sk-first-draft')
      })
      expect(result.current.setProvider).toBe(initialSetProvider)
      expect(result.current.setApiKey).toBe(initialSetApiKey)
      // setSaveForSession depends on [provider, apiKey], so it updates when apiKey changes
      expect(result.current.setSaveForSession).not.toBe(initialSetSaveForSession)

      const setSaveAfterKeyUpdate = result.current.setSaveForSession

      // Toggling saveForSession updates setApiKey (which depends on saveForSession),
      // but does NOT update setSaveForSession (which depends on [provider, apiKey])
      act(() => {
        result.current.setSaveForSession(true)
      })
      expect(result.current.setApiKey).not.toBe(initialSetApiKey)
      expect(result.current.setSaveForSession).toBe(setSaveAfterKeyUpdate)

      const setApiKeyAfterSave = result.current.setApiKey

      // Changing provider updates both callbacks because provider is in both dependency arrays
      act(() => {
        result.current.setProvider('anthropic')
      })
      expect(result.current.setProvider).toBe(initialSetProvider)
      expect(result.current.setApiKey).not.toBe(setApiKeyAfterSave)
      expect(result.current.setSaveForSession).not.toBe(setSaveAfterKeyUpdate)
    })
  })
})
