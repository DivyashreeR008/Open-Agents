import { describe, expect, it } from 'vitest'
import { parseCollectionImport, serializeCollection } from './collectionTransfer'

describe('collection import name controls', () => {
  it('removes bidirectional control characters that can spoof the visible name', () => {
    const exported = serializeCollection({
      name: 'Safe\u202Eevil\u2066x\u2069',
      agentIds: [],
    })

    const result = parseCollectionImport(exported)

    expect(result.ok).toBe(true)
    expect(result.name).toBe('Safeevilx')
  })
})
