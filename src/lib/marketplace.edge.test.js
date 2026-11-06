import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadListings, publishAgent, sanitizeAgentConfig } from './marketplace'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('marketplace sanitization edge cases', () => {
  it('sanitizes credentials nested in arrays and leaves blank credential fields alone', () => {
    const { config, sanitizedFields } = sanitizeAgentConfig({
      headers: [{ apiKey: 'sk-live-secret' }, { note: 'public' }],
      password: '',
      name: 'Safe agent',
    })

    expect(config.headers[0].apiKey).toBe('YOUR_APIKEY_HERE')
    expect(config.headers[0].apiKey).not.toContain('sk-live-secret')
    expect(config.headers[1].note).toBe('public')
    expect(config.password).toBe('')
    expect(sanitizedFields).toEqual(['headers[0].apiKey'])
  })

  it('never stores a raw secret when publishing a listing', () => {
    const published = publishAgent({
      name: 'Secret holder',
      description: 'Tests publish sanitization',
      category: 'Data Processing',
      config: { nested: { token: 'super-secret-token' } },
    })

    expect(published.persisted).toBe(true)
    expect(published.config.nested.token).toContain('HERE')
    expect(localStorage.getItem('oa_marketplace_listings')).not.toContain('super-secret-token')
    expect(loadListings()[0].name).toBe('Secret holder')
  })
})
