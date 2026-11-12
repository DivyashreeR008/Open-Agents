import { describe, expect, it } from 'vitest'
import { COLLECTION_EXPORT_FORMAT, parseCollectionImport } from './collectionTransfer'

function payload(agentIds) {
  return JSON.stringify({
    format: COLLECTION_EXPORT_FORMAT,
    version: 1,
    collection: { name: 'Picks', agentIds },
  })
}

describe('parseCollectionImport known agent ids as a string', () => {
  it('treats a single string as one known id', () => {
    expect(parseCollectionImport(payload(['a1', 'a2']), { knownAgentIds: 'a1' })).toMatchObject({
      ok: true,
      agentIds: ['a1'],
      skippedAgentIds: ['a2'],
    })
  })
})
