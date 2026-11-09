import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getGlobalKeys } from './globalKeys'

const OPENAI_KEY = 'OpenAgents_openai_key'

describe('global session key validation', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('removes a JSON null record instead of returning the word null as a key', () => {
    sessionStorage.setItem(OPENAI_KEY, 'null')

    expect(getGlobalKeys().openai).toBe('')
    expect(sessionStorage.getItem(OPENAI_KEY)).toBeNull()
  })

  it('removes records without a finite expiry', () => {
    sessionStorage.setItem(OPENAI_KEY, JSON.stringify({ key: 'sk-live' }))
    expect(getGlobalKeys().openai).toBe('')
    expect(sessionStorage.getItem(OPENAI_KEY)).toBeNull()

    sessionStorage.setItem(OPENAI_KEY, JSON.stringify({ key: 'sk-live', expiresAt: 'never' }))
    expect(getGlobalKeys().openai).toBe('')
    expect(sessionStorage.getItem(OPENAI_KEY)).toBeNull()
  })

  it('returns a valid unexpired session key', () => {
    sessionStorage.setItem(
      OPENAI_KEY,
      JSON.stringify({ key: 'sk-live', expiresAt: Date.now() + 60_000 })
    )

    expect(getGlobalKeys().openai).toBe('sk-live')
  })
})
