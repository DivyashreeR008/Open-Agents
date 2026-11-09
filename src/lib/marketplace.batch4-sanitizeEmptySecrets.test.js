import { describe, expect, it } from 'vitest'
import { sanitizeAgentConfig } from './marketplace'

describe('marketplace sanitize empty and non-string credentials', () => {
  it('leaves empty strings and non-string values in place while sanitizing whitespace', () => {
    expect(
      sanitizeAgentConfig({
        apiKey: '',
        token: 42,
        password: null,
        nested: { authorization: '   ' },
      })
    ).toEqual({
      config: {
        apiKey: '',
        token: 42,
        password: null,
        nested: { authorization: 'YOUR_AUTHORIZATION_HERE' },
      },
      sanitizedFields: ['nested.authorization'],
    })
  })
})
