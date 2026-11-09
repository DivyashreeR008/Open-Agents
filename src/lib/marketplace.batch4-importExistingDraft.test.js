import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { importAgent, loadDrafts, publishAgent } from './marketplace'

describe('marketplace repeat import', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => localStorage.clear())

  it('returns the existing draft and leaves the import count unchanged', () => {
    const listing = publishAgent({
      name: 'Repeat target',
      description: 'd',
      tags: [],
      category: 'Research',
      config: {},
    })

    const first = importAgent(listing.id)
    const second = importAgent(listing.id)

    expect(second).toMatchObject({ id: first.id, alreadyImported: true })
    expect(loadDrafts()).toHaveLength(1)
  })
})
