import { describe, expect, it } from 'vitest'
import { sanitizeAgentConfig } from './marketplace'

describe('marketplace sanitize non-object configs', () => {
  it('returns primitive and array roots unchanged without credential paths', () => {
    expect(sanitizeAgentConfig('plain')).toEqual({ config: 'plain', sanitizedFields: [] })
    expect(sanitizeAgentConfig(['apiKey'])).toEqual({
      config: ['apiKey'],
      sanitizedFields: [],
    })
    expect(sanitizeAgentConfig(null)).toEqual({ config: {}, sanitizedFields: [] })
  })
})
