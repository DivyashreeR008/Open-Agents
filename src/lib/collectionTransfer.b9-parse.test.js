import { describe, expect, it } from 'vitest'
import { COLLECTION_EXPORT_FORMAT, parseCollectionImport } from './collectionTransfer'
import { MAX_AGENTS_PER_COLLECTION } from './useCollections'

const fileWith = (agentIds) =>
  JSON.stringify({
    format: COLLECTION_EXPORT_FORMAT,
    version: 1,
    collection: { name: 'Duplicates', agentIds },
  })

describe('collection import duplicate accounting', () => {
  it('does not reject a file whose duplicate ids collapse under the limit', () => {
    const repeated = Array.from({ length: MAX_AGENTS_PER_COLLECTION + 25 }, () => 'agent-one')

    const result = parseCollectionImport(fileWith(repeated))

    expect(result.ok).toBe(true)
    expect(result.agentIds).toEqual(['agent-one'])
  })

  it('still rejects a file with too many distinct agents', () => {
    const distinct = Array.from({ length: MAX_AGENTS_PER_COLLECTION + 1 }, (_, i) => `agent-${i}`)

    const result = parseCollectionImport(fileWith(distinct))

    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/at most/i)
  })

  it('applies the catalogue filter after duplicate ids are collapsed', () => {
    const result = parseCollectionImport(fileWith(['known', 'known', 'missing']), {
      knownAgentIds: ['known'],
    })

    expect(result).toEqual({
      ok: true,
      name: 'Duplicates',
      agentIds: ['known'],
      skippedAgentIds: ['missing'],
    })
  })
})
