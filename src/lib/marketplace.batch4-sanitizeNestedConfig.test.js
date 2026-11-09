import { describe, expect, it } from 'vitest'
import { sanitizeAgentConfig } from './marketplace'

describe('marketplace nested credential sanitization', () => {
  it('sanitizes credentials in nested objects and arrays and records their paths', () => {
    const { config, sanitizedFields } = sanitizeAgentConfig({
      apiKey: 'secret',
      headers: { authorization: 'Bearer secret', empty: '' },
      providers: [{ token: 'abc' }, { nested: { password: 'pw' } }],
      keep: 42,
    })

    expect(config.apiKey).toBe('YOUR_APIKEY_HERE')
    expect(config.headers.authorization).toBe('YOUR_AUTHORIZATION_HERE')
    expect(config.headers.empty).toBe('')
    expect(config.providers[0].token).toBe('YOUR_TOKEN_HERE')
    expect(config.providers[1].nested.password).toBe('YOUR_PASSWORD_HERE')
    expect(config.keep).toBe(42)
    expect(sanitizedFields).toEqual([
      'apiKey',
      'headers.authorization',
      'providers[0].token',
      'providers[1].nested.password',
    ])
  })
})
