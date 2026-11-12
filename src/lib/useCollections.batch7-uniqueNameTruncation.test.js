import { describe, expect, it } from 'vitest'
import { MAX_COLLECTION_NAME_LENGTH, uniqueCollectionName } from './useCollections'

describe('uniqueCollectionName truncation', () => {
  it('shortens the base so the copy suffix still fits the name limit', () => {
    const name = uniqueCollectionName('a'.repeat(120), [], 'copy')

    expect(name).toHaveLength(MAX_COLLECTION_NAME_LENGTH)
    expect(name.endsWith(' (copy)')).toBe(true)
  })

  it('compares existing names case-insensitively', () => {
    expect(uniqueCollectionName('Reads', ['reads'], 'copy')).toBe('Reads (copy)')
  })
})
