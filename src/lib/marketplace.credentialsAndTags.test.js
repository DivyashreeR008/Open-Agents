import { beforeEach, describe, expect, it } from 'vitest'
import {
  filterListings,
  importAgent,
  loadListings,
  publishAgent,
  sanitizeAgentConfig,
} from './marketplace'

beforeEach(() => {
  localStorage.clear()
})

describe('marketplace credential detection', () => {
  it('keeps ordinary configuration fields intact', () => {
    const config = {
      maxTokens: 4096,
      tokenCount: 128,
      generationLimit: 20,
      author: 'Ada Lovelace',
      authenticationType: 'oauth2',
      authType: 'bearer',
      tokenizer: 'cl100k_base',
    }

    const result = sanitizeAgentConfig(config)

    expect(result.config).toEqual(config)
    expect(result.sanitizedFields).toEqual([])
  })

  it('covers key and token shapes while avoiding harmless suffixes', () => {
    const { config, sanitizedFields } = sanitizeAgentConfig({
      key: 'plain-key',
      accessKeyId: 'AKIA',
      'access-key-id': 'AKIA2',
      clientSecret: 'secret',
      bearerToken: 'abc',
      refresh_token: 'refresh',
      password: 'pw',
      authorization: 'Bearer value',
      apiKeyCount: 2,
      tokenLimit: 100,
      apiKeyName: 'production',
    })

    expect(config.key).toBe('YOUR_KEY_HERE')
    expect(config.accessKeyId).toBe('YOUR_ACCESSKEYID_HERE')
    expect(config['access-key-id']).toBe('YOUR_ACCESS_KEY_ID_HERE')
    expect(config.clientSecret).toBe('YOUR_CLIENTSECRET_HERE')
    expect(config.bearerToken).toBe('YOUR_BEARERTOKEN_HERE')
    expect(config.refresh_token).toBe('YOUR_REFRESH_TOKEN_HERE')
    expect(config.password).toBe('YOUR_PASSWORD_HERE')
    expect(config.authorization).toBe('YOUR_AUTHORIZATION_HERE')
    expect(config.apiKeyCount).toBe(2)
    expect(config.tokenLimit).toBe(100)
    expect(config.apiKeyName).toBe('production')
    expect(sanitizedFields).not.toEqual(
      expect.arrayContaining(['apiKeyCount', 'tokenLimit', 'apiKeyName'])
    )
  })

  it('publishes only true secret fields and flags the same fields on import', () => {
    const listing = publishAgent({
      name: 'Search agent',
      description: 'Finds things',
      tags: [],
      category: 'Research',
      config: { maxTokens: 10, author: 'Ada', apiKey: '', key: 'sk-live', accessKeyId: 'AKIA' },
    })

    expect(listing.config.maxTokens).toBe(10)
    expect(listing.config.author).toBe('Ada')
    expect(listing.sanitizedFields).toEqual(['key', 'accessKeyId'])

    const draft = importAgent(listing.id)
    expect(draft.pendingCredentialFields).toEqual(['key', 'accessKeyId'])
    expect(draft.config.maxTokens).toBe(10)
    expect(draft.config.author).toBe('Ada')
  })
})

describe('marketplace tags and search', () => {
  it('collapses duplicate tags before applying the limit', () => {
    const tags = [' ai ', 'AI', 'ai', 'ml', 'ML', 'one', 'two', 'three', 'four', 'five', 'six']
    const listing = publishAgent({
      name: 'Tag test',
      description: 'Tags',
      tags,
      category: 'Research',
      config: {},
    })

    expect(listing.tags).toEqual(['ai', 'ml', 'one', 'two', 'three', 'four', 'five', 'six'])
    expect(new Set(listing.tags.map((tag) => tag.toLowerCase())).size).toBe(listing.tags.length)
    expect(loadListings()[0].tags).toEqual(listing.tags)
  })

  it('searches names, authors, descriptions, and tags', () => {
    const listings = loadListings()
    expect(listings).toHaveLength(0)
    const published = publishAgent({
      name: 'Visible title',
      description: 'Handles quarterly revenue reports',
      author: 'Grace Hopper',
      tags: ['finance'],
      category: 'Research',
      config: {},
    })
    const items = loadListings()

    expect(filterListings(items, { search: 'grace' })).toHaveLength(1)
    expect(filterListings(items, { search: 'quarterly revenue' })).toHaveLength(1)
    expect(filterListings(items, { search: 'finance' })[0].id).toBe(published.id)
  })
})
