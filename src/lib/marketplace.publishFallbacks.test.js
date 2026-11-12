import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import {
  MARKETPLACE_CATEGORIES,
  loadListings,
  publishAgent,
  sanitizeAgentConfig,
} from './marketplace'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('publish and load fallbacks', () => {
  it('treats an undefined config as an empty object', () => {
    expect(sanitizeAgentConfig(undefined)).toEqual({ config: {}, sanitizedFields: [] })
  })

  it('publishes a minimal entry with safe defaults', () => {
    const listing = publishAgent({ config: {} })

    expect(listing.name).toBe('')
    expect(listing.description).toBe('')
    expect(listing.tags).toEqual([])
    expect(listing.category).toBe(MARKETPLACE_CATEGORIES[0])
    expect(listing.author).toBe('Anonymous')
    expect(listing.persisted).toBe(true)
  })

  it('trims tags, drops empty entries, and keeps at most eight', () => {
    const listing = publishAgent({
      name: 'Tagged',
      tags: [' one ', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
      config: {},
    })

    expect(listing.tags).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'])
  })

  it('uses the first category when the requested one is unknown', () => {
    const listing = publishAgent({ name: 'Unknown category', category: 'Nope', config: {} })
    expect(listing.category).toBe(MARKETPLACE_CATEGORIES[0])
  })

  it('returns an empty list when stored listings are not an array', () => {
    localStorage.setItem('oa_marketplace_listings', '"not-an-array"')
    expect(loadListings()).toEqual([])
  })
})
