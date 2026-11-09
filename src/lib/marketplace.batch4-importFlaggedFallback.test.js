import { afterEach, describe, expect, it } from 'vitest'
import { importAgent } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'

describe('marketplace import fallback fields', () => {
  afterEach(() => localStorage.clear())

  it('treats a malformed sanitizedFields value as no pending credentials', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        {
          id: 'listing-1',
          name: 'Imported listing',
          description: 'A listing',
          tags: ['one'],
          config: null,
          sanitizedFields: 'not-an-array',
          importCount: 0,
        },
      ])
    )

    const draft = importAgent('listing-1')

    expect(draft).toMatchObject({
      sourceListingId: 'listing-1',
      config: {},
      pendingCredentialFields: [],
      readyToRun: true,
    })
  })
})
