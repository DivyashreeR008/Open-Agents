import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('credential field stripping', () => {
  it('removes credential-shaped keys at every depth and keeps arrays aligned', () => {
    expect(
      stripCredentialFields({
        apiKey: 'secret',
        nested: { token: 't', safe: 1 },
        list: [{ password: 'p', name: 'n' }, 'plain'],
      })
    ).toEqual({
      nested: { safe: 1 },
      list: [{ name: 'n' }, 'plain'],
    })
  })

  it('leaves dates, class instances, and primitives intact', () => {
    const date = new Date('2026-01-01T00:00:00.000Z')
    expect(stripCredentialFields(date)).toBe(date)
    expect(stripCredentialFields('token')).toBe('token')
    expect(stripCredentialFields(null)).toBeNull()
  })
})
