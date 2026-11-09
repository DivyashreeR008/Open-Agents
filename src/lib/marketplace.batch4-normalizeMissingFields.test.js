import { describe, expect, it } from 'vitest'
import { MARKETPLACE_CATEGORIES, normalizeListing } from './marketplace'

describe('marketplace listing normalization fallbacks', () => {
  it('rejects records without a usable id', () => {
    expect(normalizeListing(null)).toBeNull()
    expect(normalizeListing([])).toBeNull()
    expect(normalizeListing({ id: '   ' })).toBeNull()
    expect(normalizeListing({ id: 42 })).toBeNull()
  })

  it('fills display fields and drops non-string tags', () => {
    const listing = normalizeListing({
      id: '  mkt_1  ',
      name: '   ',
      tags: [' keep ', 3, '', null],
      category: '',
      author: '   ',
      config: [],
      sanitizedFields: ['apiKey', '', 7],
      importCount: -2,
      publishedAt: 12,
    })

    expect(listing).toMatchObject({
      id: 'mkt_1',
      name: 'Untitled listing',
      description: '',
      tags: [' keep '],
      category: MARKETPLACE_CATEGORIES[0],
      readme: '',
      author: 'Anonymous',
      config: {},
      sanitizedFields: ['apiKey'],
      importCount: 0,
      publishedAt: '',
    })
  })
})
