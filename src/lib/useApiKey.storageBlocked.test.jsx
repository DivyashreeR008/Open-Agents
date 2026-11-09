import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useApiKey } from './useApiKey'

describe('useApiKey when storage is blocked', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    sessionStorage.clear()
    localStorage.clear()
  })

  it('renders with an empty key when reads throw', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('')
    expect(result.current.saveForSession).toBe(false)
  })

  it('keeps the in-memory key when a write throws', () => {
    const { result } = renderHook(() => useApiKey())

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    act(() => result.current.setSaveForSession(true))
    act(() => result.current.setApiKey('sk-in-memory'))

    expect(result.current.apiKey).toBe('sk-in-memory')
    expect(result.current.saveForSession).toBe(true)
  })
})
