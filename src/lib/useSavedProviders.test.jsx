import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { canRunWithSavedKeys, getSavedProviders, useSavedProviders } from './useApiKey'
import { saveGlobalKeys } from './globalKeys'

function session(provider, key, expiresAt = Date.now() + 60000) {
  sessionStorage.setItem(`oa_apikey_${provider}`, JSON.stringify({ key, expiresAt }))
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('saved provider availability', () => {
  it('joins both existing key stores and returns only provider IDs', () => {
    saveGlobalKeys({ openai: 'synthetic-global', openrouter: 'synthetic-router' })
    session('anthropic', 'synthetic-session')
    expect(getSavedProviders()).toEqual(['openai', 'anthropic', 'openrouter'])
    expect(JSON.stringify(getSavedProviders())).not.toContain('synthetic')
  })

  it('honors expiry and falls back from an expired runner key to a live Settings key', () => {
    session('openai', 'old', Date.now() - 1)
    session('gemini', 'old', Date.now() - 1)
    saveGlobalKeys({ openai: 'live' })
    expect(getSavedProviders()).toEqual(['openai'])
    expect(sessionStorage.getItem('oa_apikey_gemini')).toBeNull()
    expect(sessionStorage.getItem('oa_apikey_openai')).toBeNull()
  })

  it('matches runner precedence when a whitespace session value shadows a global key', () => {
    saveGlobalKeys({ openai: 'live' })
    session('openai', '  ')
    expect(getSavedProviders()).toEqual([])
  })

  it('keeps the established legacy and malformed-record behavior', () => {
    sessionStorage.setItem('oa_apikey_openai', 'synthetic-legacy')
    sessionStorage.setItem(
      'oa_apikey_anthropic',
      JSON.stringify({ key: 123, expiresAt: Date.now() + 60000 })
    )
    expect(getSavedProviders()).toEqual(['openai'])
    expect(sessionStorage.getItem('oa_apikey_anthropic')).toBeNull()
  })

  it('fails closed when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(getSavedProviders()).toEqual([])
  })

  it('matches fixed providers and requires a key for any-provider agents', () => {
    expect(canRunWithSavedKeys({ provider: 'openai' }, ['gemini'])).toBe(false)
    expect(canRunWithSavedKeys({ provider: 'openai' }, ['openai'])).toBe(true)
    expect(canRunWithSavedKeys({ provider: 'any' }, ['gemini'])).toBe(true)
    expect(canRunWithSavedKeys({}, ['gemini'])).toBe(true)
    expect(canRunWithSavedKeys({ provider: 'any' }, [])).toBe(false)
    expect(canRunWithSavedKeys({ provider: 'unsupported' }, ['openai'])).toBe(false)
  })

  it('observes same-tab writes, removals and expiry, then cleans up its timer', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(useSavedProviders)
    expect(result.current).toEqual([])
    session('gemini', 'synthetic', Date.now() + 2500)
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current).toEqual(['gemini'])
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current).toEqual([])
    session('openai', 'synthetic')
    act(() => window.dispatchEvent(new Event('focus')))
    expect(result.current).toEqual(['openai'])
    sessionStorage.removeItem('oa_apikey_openai')
    act(() => window.dispatchEvent(new Event('storage')))
    expect(result.current).toEqual([])
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
