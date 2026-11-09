import { beforeEach, describe, expect, it } from 'vitest'
import { importAgent } from './marketplace'

beforeEach(() => {
  localStorage.clear()
})

describe('marketplace missing import target', () => {
  it('returns null when the listing no longer exists', () => {
    expect(importAgent('mkt_missing')).toBeNull()
    expect(localStorage.getItem('oa_marketplace_drafts')).toBeNull()
  })
})
