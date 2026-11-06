import { afterEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useApiKey } from './useApiKey'
import { saveGlobalKeys } from './globalKeys'

const SESSION_KEY = (provider) => `oa_apikey_${provider}`

function storedSessionKey(provider) {
  const raw = sessionStorage.getItem(SESSION_KEY(provider))
  return raw ? JSON.parse(raw) : null
}

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('useApiKey session and global storage policy', () => {
  it('prefers a live session key over a global key and marks it as session persisted', () => {
    const expiresAt = Date.now() + 60_000
    sessionStorage.setItem(
      SESSION_KEY('openai'),
      JSON.stringify({ key: 'session-secret', expiresAt })
    )
    saveGlobalKeys({ openai: 'global-secret' })

    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('session-secret')
    expect(result.current.saveForSession).toBe(true)
    expect(storedSessionKey('openai')).toEqual({ key: 'session-secret', expiresAt })
  })

  it('purges an expired session key and falls back to the global key without session opt-in', () => {
    sessionStorage.setItem(
      SESSION_KEY('anthropic'),
      JSON.stringify({ key: 'expired-secret', expiresAt: Date.now() - 1_000 })
    )
    saveGlobalKeys({ anthropic: 'global-anthropic' })

    const { result } = renderHook(() => useApiKey())
    act(() => result.current.setProvider('anthropic'))

    expect(result.current.apiKey).toBe('global-anthropic')
    expect(result.current.saveForSession).toBe(false)
    expect(sessionStorage.getItem(SESSION_KEY('anthropic'))).toBeNull()
  })

  it('migrates a legacy plaintext session value instead of discarding it', () => {
    sessionStorage.setItem(SESSION_KEY('gemini'), 'legacy-gemini-key')

    const { result } = renderHook(() => useApiKey())
    act(() => result.current.setProvider('gemini'))

    expect(result.current.apiKey).toBe('legacy-gemini-key')
    expect(result.current.saveForSession).toBe(true)
    expect(sessionStorage.getItem(SESSION_KEY('gemini'))).toBe('legacy-gemini-key')
  })

  it('writes, rotates and purges the session copy as persistence is toggled', () => {
    const { result } = renderHook(() => useApiKey())

    act(() => result.current.setApiKey('sk-draft'))
    expect(sessionStorage.getItem(SESSION_KEY('openai'))).toBeNull()

    act(() => result.current.setSaveForSession(true))
    expect(storedSessionKey('openai').key).toBe('sk-draft')
    expect(storedSessionKey('openai').expiresAt).toBeGreaterThan(Date.now())

    act(() => result.current.setApiKey('sk-rotated'))
    expect(storedSessionKey('openai').key).toBe('sk-rotated')

    act(() => result.current.setSaveForSession(false))
    expect(sessionStorage.getItem(SESSION_KEY('openai'))).toBeNull()

    act(() => result.current.setSaveForSession(true))
    expect(storedSessionKey('openai').key).toBe('sk-rotated')

    act(() => result.current.setApiKey(''))
    expect(sessionStorage.getItem(SESSION_KEY('openai'))).toBeNull()
  })
})
