import { describe, expect, it } from 'vitest'
import { sanitizeAgentConfig } from './marketplace'

describe('sanitizeAgentConfig non-string credential values', () => {
  it('keeps a numeric credential value but redacts a nested string', () => {
    const { config, sanitizedFields } = sanitizeAgentConfig({
      apiKey: 123,
      nested: { token: 'abc' },
    })

    expect(config.apiKey).toBe(123)
    expect(config.nested.token).toBe('YOUR_TOKEN_HERE')
    expect(sanitizedFields).toEqual(['nested.token'])
  })
})
