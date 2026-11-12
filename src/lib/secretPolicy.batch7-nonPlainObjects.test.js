import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('stripCredentialFields non-plain values', () => {
  it('leaves Date and Map instances untouched', () => {
    const date = new Date('2026-01-01T00:00:00Z')
    const map = new Map([['token', 'secret']])
    const result = stripCredentialFields({ date, map })

    expect(result.date).toBe(date)
    expect(result.map).toBe(map)
  })

  it('strips a credential key padded with spaces', () => {
    expect(stripCredentialFields({ '  token  ': 'secret', keep: 'yes' })).toEqual({ keep: 'yes' })
  })
})
