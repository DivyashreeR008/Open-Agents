import { beforeEach, describe, expect, it } from 'vitest'
import { importAgent } from './marketplace'

beforeEach(() => localStorage.clear())

describe('importAgent sanitized field shape', () => {
  it('marks a listing without an array of flagged fields as ready to run', () => {
    localStorage.setItem(
      'oa_marketplace_listings',
      JSON.stringify([
        {
          id: 'l1',
          name: 'Agent',
          description: 'Desc',
          tags: [],
          config: {},
          sanitizedFields: 'not-an-array',
        },
      ])
    )

    const draft = importAgent('l1')

    expect(draft.pendingCredentialFields).toEqual([])
    expect(draft.readyToRun).toBe(true)
  })
})
