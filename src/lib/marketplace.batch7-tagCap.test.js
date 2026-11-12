import { beforeEach, describe, expect, it } from 'vitest'
import { publishAgent } from './marketplace'

beforeEach(() => localStorage.clear())

describe('publishAgent tag limits', () => {
  it('keeps the first eight non-blank tags and trims them', () => {
    const tags = [' one ', '', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    const listing = publishAgent({ name: 'Agent', description: 'Desc', tags, config: {} })

    expect(listing.tags).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'])
    expect(listing.persisted).toBe(true)
  })
})
