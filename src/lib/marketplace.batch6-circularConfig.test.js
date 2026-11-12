import { describe, expect, it } from 'vitest'
import { sanitizeAgentConfig } from './marketplace'

describe('marketplace config sanitization with circular data', () => {
  it('keeps the cycle instead of recursing forever and still redacts secrets', () => {
    const config = {
      name: 'Looping agent',
      apiKey: 'sk-live-secret',
      nested: { token: 'token-value' },
    }
    config.self = config
    config.nested.parent = config

    const result = sanitizeAgentConfig(config)

    expect(result.config.self).toBe(result.config)
    expect(result.config.nested.parent).toBe(result.config)
    expect(result.config.apiKey).toBe('YOUR_APIKEY_HERE')
    expect(result.config.nested.token).toBe('YOUR_TOKEN_HERE')
    expect(result.sanitizedFields).toEqual(expect.arrayContaining(['apiKey', 'nested.token']))
  })
})
