import { beforeEach, describe, expect, it } from 'vitest'
import { publishAgent } from './marketplace'

beforeEach(() => {
  localStorage.clear()
})

describe('marketplace publish null tags', () => {
  it('treats a null tag list as empty metadata', () => {
    const listing = publishAgent({
      name: 'No tags',
      description: 'Publishes without a tag array',
      tags: null,
      category: 'Research',
      config: {},
    })

    expect(listing.tags).toEqual([])
    expect(listing.persisted).toBe(true)
  })
})
