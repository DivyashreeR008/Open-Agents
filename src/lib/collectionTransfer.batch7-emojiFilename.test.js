import { describe, expect, it } from 'vitest'
import { collectionExportFilename } from './collectionTransfer'

describe('collectionExportFilename unusual names', () => {
  it('drops emoji and collapses separators', () => {
    expect(collectionExportFilename({ name: 'Research 🚀 Notes' })).toBe(
      'collection-research-notes.json'
    )
  })

  it('caps the slug at forty characters', () => {
    const filename = collectionExportFilename({ name: 'a'.repeat(80) })
    expect(filename).toBe('collection-' + 'a'.repeat(40) + '.json')
  })
})
