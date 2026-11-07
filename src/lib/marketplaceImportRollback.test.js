import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { importAgent, loadDrafts, loadListings, publishAgent } from './marketplace'

const LISTINGS_KEY = 'oa_marketplace_listings'
const DRAFTS_KEY = 'oa_marketplace_drafts'

function seedListing() {
  const listing = {
    id: 'mkt_rollback',
    name: 'Rollback Target',
    description: 'A listing used to exercise import rollback',
    tags: ['research'],
    category: 'Research',
    author: 'Tester',
    config: { baseAgentId: 'summarizer' },
    sanitizedFields: [],
    importCount: 0,
    ratingTotal: 0,
    ratingCount: 0,
    publishedAt: '2026-03-01T12:00:00.000Z',
  }
  localStorage.setItem(LISTINGS_KEY, JSON.stringify([listing]))
  return listing
}

beforeEach(() => localStorage.clear())
afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('marketplace import rollback', () => {
  it('restores the draft store when the source import count cannot be saved', () => {
    seedListing()
    localStorage.setItem(DRAFTS_KEY, JSON.stringify([]))
    const originalSetItem = Storage.prototype.setItem
    let listingsWrites = 0
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (key, value) {
      if (key === LISTINGS_KEY) {
        listingsWrites += 1
        throw new Error('QuotaExceededError')
      }
      return originalSetItem.call(this, key, value)
    })

    const draft = importAgent('mkt_rollback')

    expect(listingsWrites).toBe(1)
    expect(draft).toMatchObject({ sourceListingId: 'mkt_rollback', persisted: false })
    expect(loadDrafts()).toEqual([])
    expect(loadListings()[0].importCount).toBe(0)
  })

  it('does not return a success shape when the initial draft write is refused', () => {
    seedListing()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    const draft = importAgent('mkt_rollback')

    expect(draft.persisted).toBe(false)
    expect(loadDrafts()).toEqual([])
  })

  it('keeps a published listing usable when its draft cannot be created', () => {
    const listing = publishAgent({
      name: 'Unsaved import target',
      description: 'Published before storage filled up',
      category: 'Research',
      tags: [],
      config: {},
    })
    expect(listing.persisted).toBe(true)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    const draft = importAgent(listing.id)

    expect(draft.persisted).toBe(false)
    expect(loadDrafts()).toEqual([])
  })
})
