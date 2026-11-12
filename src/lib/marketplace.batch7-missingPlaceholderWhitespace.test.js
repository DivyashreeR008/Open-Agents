import { describe, expect, it } from 'vitest'
import { getMissingDraftFields } from './marketplace'

describe('getMissingDraftFields placeholder whitespace', () => {
  it('still treats a padded placeholder as missing', () => {
    const draft = { pendingCredentialFields: ['API_KEY'] }

    expect(getMissingDraftFields(draft, { API_KEY: '  YOUR_API_KEY_HERE  ' })).toEqual(['API_KEY'])
  })
})
