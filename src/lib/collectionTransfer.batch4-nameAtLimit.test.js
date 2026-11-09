import { describe, expect, it } from 'vitest'
import { COLLECTION_EXPORT_FORMAT, parseCollectionImport } from './collectionTransfer'
import { MAX_COLLECTION_NAME_LENGTH } from './useCollections'

describe('collection import name boundary', () => {
  it('accepts a name that is exactly the maximum length', () => {
    const name = 'x'.repeat(MAX_COLLECTION_NAME_LENGTH)
    const result = parseCollectionImport(
      JSON.stringify({
        format: COLLECTION_EXPORT_FORMAT,
        version: 1,
        collection: { name, agentIds: ['agent-1'] },
      })
    )

    expect(result).toEqual({
      ok: true,
      name,
      agentIds: ['agent-1'],
      skippedAgentIds: [],
    })
  })
})
