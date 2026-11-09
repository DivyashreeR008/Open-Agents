import { describe, expect, it } from 'vitest'
import { COLLECTION_EXPORT_FORMAT, parseCollectionImport } from './collectionTransfer'

const payload = (overrides = {}) =>
  JSON.stringify({
    format: COLLECTION_EXPORT_FORMAT,
    version: 1,
    collection: { name: 'Imported', agentIds: ['agent-1'], ...overrides },
  })

describe('collection import validation', () => {
  it('rejects malformed JSON, wrong formats, and unsupported versions', () => {
    expect(parseCollectionImport('{')).toEqual({ ok: false, error: 'The file is not valid JSON.' })
    expect(parseCollectionImport('[]')).toEqual({
      ok: false,
      error: 'This is not an Open Agents collection file.',
    })
    expect(
      parseCollectionImport(
        JSON.stringify({ format: COLLECTION_EXPORT_FORMAT, version: 99, collection: {} })
      )
    ).toEqual({ ok: false, error: 'Unsupported collection file version: 99.' })
  })

  it('rejects empty names, invalid ids, and oversized lists', () => {
    expect(parseCollectionImport(payload({ name: '   ' }))).toEqual({
      ok: false,
      error: 'The collection needs a name.',
    })
    expect(parseCollectionImport(payload({ agentIds: ['bad id'] }))).toEqual({
      ok: false,
      error: 'The agent list contains an invalid agent id.',
    })
    expect(parseCollectionImport(payload({ agentIds: Array(16).fill('a') }))).toEqual({
      ok: false,
      error: 'A collection can hold at most 15 agents.',
    })
  })

  it('deduplicates ids and reports ids missing from the catalogue', () => {
    expect(
      parseCollectionImport(payload({ agentIds: ['a', 'a', 'b'] }), {
        knownAgentIds: ['a'],
      })
    ).toEqual({ ok: true, name: 'Imported', agentIds: ['a'], skippedAgentIds: ['b'] })
  })
})
