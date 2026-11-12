import { describe, expect, it } from 'vitest'
import { collectionExportFilename, serializeCollection } from './collectionTransfer'

describe('collection export helpers with malformed collections', () => {
  it('falls back to a safe filename when the collection name is missing', () => {
    expect(collectionExportFilename({ name: null })).toBe('collection-export.json')
    expect(collectionExportFilename({})).toBe('collection-export.json')
  })

  it('serializes an empty agent list when agentIds is missing', () => {
    const parsed = JSON.parse(serializeCollection({ name: 'Empty collection' }))
    expect(parsed.collection.agentIds).toEqual([])
  })
})
