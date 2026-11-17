import { describe, expect, it } from 'vitest'
import { stripCredentialFields } from './secretPolicy'

describe('credential-shaped export values', () => {
  it('redacts recognizable tokens pasted into ordinary text fields', () => {
    const result = stripCredentialFields({
      title: 'Release notes',
      prompt: 'Use sk-proj-abcdefghijklmnop123456 for the demo',
      note: 'GitHub token ghp_abcdefghijklmnopqrstuvwxyz0123456789',
      rows: [{ detail: 'AWS key AKIAABCDEFGHIJKLMNOP' }],
    })

    expect(result.title).toBe('Release notes')
    expect(result.prompt).toBe('Use [REDACTED] for the demo')
    expect(result.note).toBe('GitHub token [REDACTED]')
    expect(result.rows[0].detail).toBe('AWS key [REDACTED]')
  })

  it('redacts key/value assignments that do not use a credential field name', () => {
    const result = stripCredentialFields({
      instructions: 'api_key = super-secret-value password: hunter2hunter2',
    })

    expect(result.instructions).toBe('api_key = [REDACTED] password: [REDACTED]')
  })

  it('redacts JWT-shaped values in arrays without dropping surrounding data', () => {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature123'
    const result = stripCredentialFields({ history: [token, 'keep me'] })

    expect(result.history).toEqual(['[REDACTED]', 'keep me'])
  })

  it('leaves ordinary prose that mentions credentials alone', () => {
    const safe = {
      description: 'Rotate the API key every quarter and never paste a token into a prompt.',
      count: 3,
    }

    expect(stripCredentialFields(safe)).toEqual(safe)
  })
})
