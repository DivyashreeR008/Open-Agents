import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useApiKey } from './useApiKey'

const KEY = 'oa_apikey_openai'

describe('useApiKey malformed session records', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('discards a JSON null record instead of using the literal text as a key', () => {
    sessionStorage.setItem(KEY, 'null')

    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('')
    expect(result.current.saveForSession).toBe(false)
    expect(sessionStorage.getItem(KEY)).toBeNull()
  })

  it('discards a record that has a key but no finite expiry', () => {
    sessionStorage.setItem(KEY, JSON.stringify({ key: 'sk-live' }))

    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('')
    expect(sessionStorage.getItem(KEY)).toBeNull()
  })

  it('discards a record whose expiry is not numeric', () => {
    sessionStorage.setItem(KEY, JSON.stringify({ key: 'sk-live', expiresAt: 'tomorrow' }))

    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('')
    expect(sessionStorage.getItem(KEY)).toBeNull()
  })

  it('still restores a valid unexpired record', () => {
    sessionStorage.setItem(KEY, JSON.stringify({ key: 'sk-live', expiresAt: Date.now() + 60_000 }))

    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('sk-live')
    expect(result.current.saveForSession).toBe(true)
  })
})
