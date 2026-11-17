import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getGlobalKeys } from './globalKeys'

const SESSION_KEY = 'OpenAgents_openai_key'

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-01T08:00:00.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('legacy session key expiry', () => {
  it('wraps a plaintext session value with the standard expiry on first read', () => {
    sessionStorage.setItem(SESSION_KEY, 'legacy-plaintext-key')

    expect(getGlobalKeys().openai).toBe('legacy-plaintext-key')
    expect(JSON.parse(sessionStorage.getItem(SESSION_KEY))).toMatchObject({
      key: 'legacy-plaintext-key',
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    })
  })

  it('removes the migrated legacy value when the expiry passes', () => {
    sessionStorage.setItem(SESSION_KEY, 'legacy-plaintext-key')
    getGlobalKeys()

    vi.advanceTimersByTime(8 * 60 * 60 * 1000 + 1)

    expect(getGlobalKeys().openai).toBe('')
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull()
  })
})
