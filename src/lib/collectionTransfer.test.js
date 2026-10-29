import { describe, it, expect } from 'vitest'
import {
  COLLECTION_EXPORT_FORMAT,
  MAX_COLLECTION_IMPORT_BYTES,
  collectionExportFilename,
  parseCollectionImport,
  serializeCollection,
} from './collectionTransfer'
import { MAX_AGENTS_PER_COLLECTION } from './useCollections'

const collection = {
  id: 'abc',
  name: 'Launch planning',
  agentIds: ['a1', 'b-2'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  isDefault: false,
}

const file = (overrides = {}) =>
  JSON.stringify({
    format: COLLECTION_EXPORT_FORMAT,
    version: 1,
    collection: { name: 'Reads', agentIds: ['a1'] },
    ...overrides,
  })

describe('serializeCollection', () => {
  it('exports only the name and agent ids', () => {
    const data = JSON.parse(serializeCollection(collection))
    expect(data.format).toBe(COLLECTION_EXPORT_FORMAT)
    expect(data.version).toBe(1)
    expect(data.collection).toEqual({ name: 'Launch planning', agentIds: ['a1', 'b-2'] })
    expect(serializeCollection(collection)).not.toContain('abc')
    expect(serializeCollection(collection)).not.toContain('createdAt')
  })

  it('builds a safe filename', () => {
    expect(collectionExportFilename(collection)).toBe('collection-launch-planning.json')
    expect(collectionExportFilename({ name: '!!!' })).toBe('collection-export.json')
  })
})

describe('parseCollectionImport', () => {
  it('round trips an export', () => {
    const result = parseCollectionImport(serializeCollection(collection))
    expect(result).toEqual({
      ok: true,
      name: 'Launch planning',
      agentIds: ['a1', 'b-2'],
      skippedAgentIds: [],
    })
  })

  it('drops agents missing from the catalogue and reports them', () => {
    const result = parseCollectionImport(serializeCollection(collection), {
      knownAgentIds: ['a1'],
    })
    expect(result.agentIds).toEqual(['a1'])
    expect(result.skippedAgentIds).toEqual(['b-2'])
  })

  it('dedupes agent ids', () => {
    const result = parseCollectionImport(file({ collection: { name: 'X', agentIds: ['a', 'a'] } }))
    expect(result.agentIds).toEqual(['a'])
  })

  it('ignores unexpected keys, including credential-shaped ones', () => {
    const result = parseCollectionImport(
      file({
        apiKey: 'sk-should-not-survive',
        collection: {
          name: 'Reads',
          agentIds: ['a1'],
          token: 'sk-nope',
          isDefault: true,
          id: 'all-agents',
        },
      })
    )
    expect(result).toEqual({ ok: true, name: 'Reads', agentIds: ['a1'], skippedAgentIds: [] })
    expect(JSON.stringify(result)).not.toContain('sk-')
    expect({}.polluted).toBeUndefined()
  })

  it('does not let a __proto__ key pollute anything', () => {
    const text =
      '{"format":"open-agents.collection","version":1,"__proto__":{"polluted":true},' +
      '"collection":{"name":"Reads","agentIds":["a1"],"__proto__":{"polluted":true}}}'
    const result = parseCollectionImport(text)
    expect(result.ok).toBe(true)
    expect({}.polluted).toBeUndefined()
    expect(result.polluted).toBeUndefined()
  })

  it('strips control characters from the name', () => {
    const result = parseCollectionImport(file({ collection: { name: '  Re\u0000ads\n ', agentIds: [] } }))
    expect(result.name).toBe('Reads')
  })

  it.each([
    ['empty text', ''],
    ['whitespace', '   '],
    ['invalid json', '{nope'],
    ['a json array', '[]'],
    ['null', 'null'],
    ['a string', '"hi"'],
    ['wrong format', file({ format: 'something-else' })],
    ['missing format', JSON.stringify({ version: 1, collection: { name: 'a', agentIds: [] } })],
    ['no collection', file({ collection: undefined })],
    ['collection as array', file({ collection: [] })],
    ['missing name', file({ collection: { agentIds: [] } })],
    ['blank name', file({ collection: { name: '   ', agentIds: [] } })],
    ['numeric name', file({ collection: { name: 5, agentIds: [] } })],
    ['name too long', file({ collection: { name: 'x'.repeat(101), agentIds: [] } })],
    ['agentIds not an array', file({ collection: { name: 'a', agentIds: 'a1' } })],
    ['non-string agent id', file({ collection: { name: 'a', agentIds: [1] } })],
    ['agent id with path chars', file({ collection: { name: 'a', agentIds: ['../x'] } })],
    ['agent id with markup', file({ collection: { name: 'a', agentIds: ['<img>'] } })],
    [
      'too many agents',
      file({
        collection: {
          name: 'a',
          agentIds: Array.from({ length: MAX_AGENTS_PER_COLLECTION + 1 }, (_, i) => `a${i}`),
        },
      }),
    ],
  ])('rejects %s', (_label, text) => {
    const result = parseCollectionImport(text)
    expect(result.ok).toBe(false)
    expect(typeof result.error).toBe('string')
  })

  it('rejects an unsupported version with a clear message', () => {
    const result = parseCollectionImport(file({ version: 2 }))
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/unsupported/i)
    expect(parseCollectionImport(file({ version: '1' })).ok).toBe(false)
  })

  it('rejects oversized input', () => {
    const big = file({ collection: { name: 'a', agentIds: [] }, pad: 'x'.repeat(MAX_COLLECTION_IMPORT_BYTES) })
    const result = parseCollectionImport(big)
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/too large/i)
  })

  it('never reads or writes storage', () => {
    localStorage.clear()
    parseCollectionImport(serializeCollection(collection))
    expect(localStorage.length).toBe(0)
  })
})
