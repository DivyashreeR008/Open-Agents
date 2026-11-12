import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { publishAgent } from './marketplace'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('publishAgent blocked storage', () => {
  it('returns the listing with persisted false when the write fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    const listing = publishAgent({ name: 'Agent', description: 'Desc', tags: [], config: {} })

    expect(listing.persisted).toBe(false)
    expect(listing.name).toBe('Agent')
  })
})
