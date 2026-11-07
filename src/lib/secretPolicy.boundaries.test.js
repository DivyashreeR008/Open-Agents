import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('credential stripping boundaries', () => {
  it('removes credential-shaped keys surrounded by whitespace', () => {
    expect(
      stripCredentialFields({
        ' apiKey ': 'sk-live',
        'Authorization ': 'Bearer secret',
        Token: 'tok',
        keep: 'visible',
      })
    ).toEqual({ keep: 'visible' })
  })

  it('preserves Date values instead of collapsing them to an empty object', () => {
    const when = new Date('2026-01-02T03:04:05.000Z')
    const result = stripCredentialFields({ when, apiKey: 'sk-live' })

    expect(result.when).toBe(when)
    expect(result.apiKey).toBeUndefined()
  })

  it('still walks null-prototype records', () => {
    const record = Object.create(null)
    record.apiKey = 'sk-live'
    record.nested = Object.assign(Object.create(null), { token: 'secret', keep: 1 })

    expect(stripCredentialFields(record)).toEqual({ nested: { keep: 1 } })
  })
})
