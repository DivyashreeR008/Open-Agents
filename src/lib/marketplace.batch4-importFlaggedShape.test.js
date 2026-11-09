import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { importAgent } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'

describe('marketplace import credential flag shapes', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('treats a non-array flag list as ready to run', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        {
          id: 'mkt_1',
          name: 'Plain target',
          description: '',
          tags: [],
          category: 'Research',
          config: { baseAgentId: 'a' },
          sanitizedFields: 'apiKey',
          importCount: 0,
          ratingTotal: 0,
          ratingCount: 0,
        },
      ])
    )

    const draft = importAgent('mkt_1')

    expect(draft.pendingCredentialFields).toEqual([])
    expect(draft.readyToRun).toBe(true)
  })
})
