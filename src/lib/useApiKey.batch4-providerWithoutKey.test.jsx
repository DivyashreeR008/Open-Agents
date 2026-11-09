import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { saveGlobalKeys } from './globalKeys'
import { useApiKey } from './useApiKey'

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('api key provider switching without a saved key', () => {
  it('clears the key when switching to a provider with no session or global key', () => {
    saveGlobalKeys({ openai: 'global-openai' })
    const { result } = renderHook(() => useApiKey())

    expect(result.current.apiKey).toBe('global-openai')
    expect(result.current.saveForSession).toBe(false)

    act(() => result.current.setProvider('gemini'))
    expect(result.current.apiKey).toBe('')
    expect(result.current.saveForSession).toBe(false)

    act(() => result.current.setProvider('openai'))
    expect(result.current.apiKey).toBe('global-openai')
    expect(result.current.saveForSession).toBe(false)
  })
})
