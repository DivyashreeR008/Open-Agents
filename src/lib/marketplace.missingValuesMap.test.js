import { describe, expect, it } from 'vitest'
import { getMissingDraftFields } from './marketplace'

describe('marketplace draft fields with no values map', () => {
  it('reports every flagged field when values and flags are missing', () => {
    expect(getMissingDraftFields({ pendingCredentialFields: null })).toEqual([])
    expect(getMissingDraftFields({ pendingCredentialFields: ['config.apiKey'] })).toEqual([
      'config.apiKey',
    ])
  })
})
