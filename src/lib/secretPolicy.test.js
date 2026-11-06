import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('stripCredentialFields', () => {
  it('removes credential-shaped keys at every nesting level', () => {
    const input = {
      apiKey: 'sk-live-123',
      name: 'Release notes',
      nested: {
        Authorization: 'Bearer secret',
        token: 'tok_456',
        label: 'safe',
      },
      rows: [
        { password: 'hunter2', value: 1 },
        { credential: 'certificate', value: 2 },
      ],
    }

    expect(stripCredentialFields(input)).toEqual({
      name: 'Release notes',
      nested: { label: 'safe' },
      rows: [{ value: 1 }, { value: 2 }],
    })
  })

  it('matches field names without regard to case', () => {
    const result = stripCredentialFields({
      API_KEY: 'one',
      Api_Key: 'two',
      AUTHORIZATION: 'three',
      Password: 'four',
    })

    expect(result).toEqual({})
  })

  it('keeps lookalike configuration fields that do not name a secret', () => {
    const input = {
      tokenCount: 1200,
      authenticationType: 'oauth',
      secretary: 'not a credential',
      apiKeyHint: 'ends in 4f2a',
      credentialsPolicy: 'rotate quarterly',
    }

    expect(stripCredentialFields(input)).toEqual(input)
  })

  it('leaves primitive and null values untouched', () => {
    expect(stripCredentialFields(null)).toBeNull()
    expect(stripCredentialFields(undefined)).toBeUndefined()
    expect(stripCredentialFields(42)).toBe(42)
    expect(stripCredentialFields('plain text')).toBe('plain text')
    expect(stripCredentialFields(true)).toBe(true)
  })

  it('does not mutate the object it receives', () => {
    const input = { apiKey: 'secret', nested: { token: 'another' }, keep: true }
    const snapshot = JSON.parse(JSON.stringify(input))

    const result = stripCredentialFields(input)

    expect(input).toEqual(snapshot)
    expect(result).not.toBe(input)
    expect(result.nested).not.toBe(input.nested)
  })

  it('returns a new array without credential fields in its objects', () => {
    const input = [{ secret: 'a', label: 'first' }, { label: 'second' }]
    const result = stripCredentialFields(input)

    expect(result).toEqual([{ label: 'first' }, { label: 'second' }])
    expect(result).not.toBe(input)
  })
})
