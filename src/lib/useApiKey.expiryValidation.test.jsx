import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useApiKey, validateApiKeyFormat } from './useApiKey'

const KEY = 'oa_apikey_openai'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.useRealTimers()
})

describe('API key expiry and format contract', () => {
  it('flags obvious provider mismatches and accepts each published prefix', () => {
    expect(validateApiKeyFormat('openai', 'sk-proj-live')).toBe('')
    expect(validateApiKeyFormat('anthropic', 'sk-ant-live')).toBe('')
    expect(validateApiKeyFormat('gemini', 'AIzaSyLive')).toBe('')
    expect(validateApiKeyFormat('openrouter', 'sk-or-v1-live')).toBe('')
    expect(validateApiKeyFormat('openai', 'sk-ant-live')).toContain('Anthropic key')
    expect(validateApiKeyFormat('gemini', 'sk-proj-live')).toContain('Gemini key')
  })

  it('refuses to persist a mismatched key and clears the save opt-in', () => {
    const { result } = renderHook(() => useApiKey())

    act(() => result.current.setApiKey('sk-ant-live'))

    expect(result.current.keyError).toContain('Anthropic')
    expect(result.current.saveForSession).toBe(false)
    expect(sessionStorage.getItem(KEY)).toBeNull()
  })

  it('exposes the saved expiry so the interface can warn before it lapses', () => {
    const { result } = renderHook(() => useApiKey())

    act(() => result.current.setApiKey('sk-proj-live'))
    act(() => result.current.setSaveForSession(true))

    expect(result.current.saveForSession).toBe(true)
    expect(result.current.sessionExpiresAt).toBeGreaterThan(Date.now())
    expect(result.current.sessionExpired).toBe(false)
  })

  it('reports an expired saved key without restoring it', () => {
    const expiresAt = Date.now() - 1_000
    sessionStorage.setItem(KEY, JSON.stringify({ key: 'sk-expired', expiresAt }))

    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('')
    expect(result.current.saveForSession).toBe(false)
    expect(result.current.sessionExpired).toBe(true)
    expect(result.current.sessionExpiresAt).toBe(expiresAt)
    expect(sessionStorage.getItem(KEY)).toBeNull()
    expect(sessionStorage.getItem('oa_apikey_expiry_notice_openai')).toBe(String(expiresAt))
  })
})
