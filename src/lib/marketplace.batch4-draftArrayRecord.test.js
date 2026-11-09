import { afterEach, describe, expect, it } from 'vitest'
import { loadDrafts } from './marketplace'

const DRAFTS_KEY = 'oa_marketplace_drafts'

describe('marketplace draft normalization guards', () => {
  afterEach(() => localStorage.clear())

  it('drops array records and repairs malformed draft fields', () => {
    localStorage.setItem(
      DRAFTS_KEY,
      JSON.stringify([
        [],
        {
          id: 'draft-1',
          name: '   ',
          tags: ['kept', 3],
          config: [],
          pendingCredentialFields: 'bad',
          importedAt: 123,
        },
      ])
    )

    const drafts = loadDrafts()

    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({
      id: 'draft-1',
      name: 'Imported agent',
      tags: ['kept'],
      config: {},
      pendingCredentialFields: [],
      readyToRun: true,
      importedAt: '',
    })
  })
})
