import { describe, expect, it } from 'vitest'
import {
  MAX_COLLECTION_IMPORT_BYTES,
  parseCollectionImport,
  serializeCollection,
} from './collectionTransfer'

function validImport(overrides = {}) {
  return {
    ...JSON.parse(serializeCollection({ name: 'Release checks', agentIds: ['code-reviewer'] })),
    ...overrides,
  }
}

describe('collection import boundaries', () => {
  it('rejects a file whose UTF-8 bytes exceed the limit even when characters do not', () => {
    const text = JSON.stringify({ ...validImport(), padding: '\u00e9'.repeat(40000) })

    expect(text.length).toBeLessThan(MAX_COLLECTION_IMPORT_BYTES)
    expect(new TextEncoder().encode(text).length).toBeGreaterThan(MAX_COLLECTION_IMPORT_BYTES)
    expect(parseCollectionImport(text)).toEqual({
      ok: false,
      error: 'The file is too large to be a collection export.',
    })
  })

  it('treats a single known agent id as one id, not as a set of characters', () => {
    const text = JSON.stringify(
      validImport({
        collection: { name: 'Focused', agentIds: ['code-reviewer', 'sql-expert'] },
      })
    )

    expect(parseCollectionImport(text, { knownAgentIds: 'code-reviewer' })).toEqual({
      ok: true,
      name: 'Focused',
      agentIds: ['code-reviewer'],
      skippedAgentIds: ['sql-expert'],
    })
  })
})
