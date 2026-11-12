import { beforeEach, describe, expect, it } from 'vitest'
import { importAgent } from './marketplace'

beforeEach(() => localStorage.clear())

describe('importAgent missing config', () => {
  it('creates a ready draft with an empty config object', () => {
    localStorage.setItem(
      'oa_marketplace_listings',
      JSON.stringify([{ id: 'l1', name: 'Agent', description: 'Desc', tags: [] }])
    )

    const draft = importAgent('l1')

    expect(draft.config).toEqual({})
    expect(draft.readyToRun).toBe(true)
  })
})
