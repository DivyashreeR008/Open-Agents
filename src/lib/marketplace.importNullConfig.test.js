import { beforeEach, describe, expect, it } from 'vitest'
import { importAgent } from './marketplace'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(
    'oa_marketplace_listings',
    JSON.stringify([
      {
        id: 'mkt_null_config',
        name: 'Null config',
        description: 'A listing without configuration',
        tags: [],
        category: 'Research',
        author: 'Tester',
        config: null,
        sanitizedFields: [],
        importCount: 0,
        ratingCount: 0,
        ratingTotal: 0,
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
    ])
  )
})

describe('marketplace import with missing config', () => {
  it('creates an empty draft config instead of throwing', () => {
    const draft = importAgent('mkt_null_config')

    expect(draft).toMatchObject({
      sourceListingId: 'mkt_null_config',
      config: {},
      readyToRun: true,
    })
  })
})
