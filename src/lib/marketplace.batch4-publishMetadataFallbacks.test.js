import { afterEach, describe, expect, it } from 'vitest'
import { MARKETPLACE_CATEGORIES, publishAgent } from './marketplace'

describe('marketplace publish metadata fallbacks', () => {
  afterEach(() => localStorage.clear())

  it('normalizes blank authors, non-string readmes, invalid categories, and numeric tags', () => {
    const listing = publishAgent({
      name: '  Test agent  ',
      description: '  Description  ',
      tags: [1, '  ', 'keep'],
      category: 'Not a category',
      readme: 0,
      author: '   ',
      config: {},
    })

    expect(listing.name).toBe('Test agent')
    expect(listing.description).toBe('Description')
    expect(listing.tags).toEqual(['1', 'keep'])
    expect(listing.category).toBe(MARKETPLACE_CATEGORIES[0])
    expect(listing.readme).toBe('')
    expect(listing.author).toBe('Anonymous')
  })
})
