import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { publishAgent } from './marketplace'

describe('publishing malformed marketplace entries', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('publishes a safe placeholder instead of throwing on a null entry', () => {
    const listing = publishAgent(null)

    expect(listing.name).toBe('')
    expect(listing.description).toBe('')
    expect(listing.tags).toEqual([])
    expect(listing.author).toBe('Anonymous')
    expect(listing.config).toEqual({})
  })

  it('treats a string tags field as no tags instead of calling map on it', () => {
    const listing = publishAgent({
      name: 'Tagged agent',
      tags: 'alpha,beta',
      config: {},
    })

    expect(listing.tags).toEqual([])
  })
})
