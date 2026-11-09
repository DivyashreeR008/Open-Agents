import { describe, expect, it } from 'vitest'
import { collectionExportFilename } from './collectionTransfer'

describe('collection export filename', () => {
  it('slugifies names and falls back when no filename characters remain', () => {
    expect(collectionExportFilename({ name: 'My Research Collection' })).toBe(
      'collection-my-research-collection.json'
    )
    expect(collectionExportFilename({ name: '!!!' })).toBe('collection-export.json')
    expect(collectionExportFilename({ name: 'a'.repeat(80) })).toHaveLength(
      'collection-'.length + 40 + '.json'.length
    )
  })
})
