import { describe, expect, it } from 'vitest'
import { buildDraftAgent } from './marketplace'

describe('buildDraftAgent without a source', () => {
  it('returns null when the draft has no config and no matching agent', () => {
    expect(buildDraftAgent({ name: 'Draft' }, [])).toBeNull()
  })
})
