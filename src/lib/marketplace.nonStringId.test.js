import { describe, expect, it } from 'vitest'
import { normalizeListing } from './marketplace'

describe('marketplace non-string listing id', () => {
  it('rejects numeric ids instead of coercing them into storage keys', () => {
    expect(normalizeListing({ id: 42, name: 'Numeric id' })).toBeNull()
  })
})
