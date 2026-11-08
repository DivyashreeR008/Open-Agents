import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  COLLECTION_EXPORT_FORMAT,
  COLLECTION_EXPORT_VERSION,
  parseCollectionImport,
} from './collectionTransfer'

const exportText = JSON.stringify({
  format: COLLECTION_EXPORT_FORMAT,
  version: COLLECTION_EXPORT_VERSION,
  collection: { name: 'Reads', agentIds: ['a1'] },
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('collection import size guard without TextEncoder', () => {
  it('falls back to string length and still accepts a valid export', () => {
    vi.stubGlobal('TextEncoder', undefined)

    expect(parseCollectionImport(exportText)).toEqual({
      ok: true,
      name: 'Reads',
      agentIds: ['a1'],
      skippedAgentIds: [],
    })
  })
})
