import { describe, expect, it } from 'vitest'
import { normalizeListing } from './marketplace'

describe('normalizeListing sanitized field filtering', () => {
  it('drops blank and non-string entries', () => {
    const listing = normalizeListing({
      id: 'l1',
      name: 'Agent',
      sanitizedFields: ['', 42, 'config.apiKey'],
    })

    expect(listing.sanitizedFields).toEqual(['config.apiKey'])
  })
})
