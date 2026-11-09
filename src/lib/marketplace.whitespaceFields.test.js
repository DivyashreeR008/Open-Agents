import { afterEach, describe, expect, it } from 'vitest'
import { MARKETPLACE_CATEGORIES, loadListings } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'

describe('marketplace listing normalization', () => {
  afterEach(() => localStorage.clear())

  it('normalizes whitespace-only identity fields and malformed optional fields', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        {
          id: '  listing-1  ',
          name: '   ',
          description: 42,
          tags: ['  ', 'kept', 7],
          category: '',
          readme: null,
          author: '   ',
          config: [],
          sanitizedFields: ['', 9, 'config.apiKey'],
          importCount: 2.9,
          ratingCount: 2,
          ratingTotal: 7,
          publishedAt: 123,
        },
      ])
    )

    const [listing] = loadListings()

    expect(listing).toMatchObject({
      id: 'listing-1',
      name: 'Untitled listing',
      description: '',
      tags: ['kept'],
      category: MARKETPLACE_CATEGORIES[0],
      readme: '',
      author: 'Anonymous',
      config: {},
      sanitizedFields: ['config.apiKey'],
      importCount: 2,
      ratingCount: 2,
      ratingTotal: 7,
      publishedAt: '',
    })
  })
})
