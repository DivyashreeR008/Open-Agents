import { describe, expect, it } from 'vitest'
import { collectionExportFilename } from './collectionTransfer'

describe('collection export filename boundaries', () => {
  it('falls back for a name with no letters or numbers', () => {
    expect(collectionExportFilename({ name: '--- ??? ---' })).toBe('collection-export.json')
  })

  it('caps the slug at forty characters without leaving a trailing dash', () => {
    const filename = collectionExportFilename({ name: 'A'.repeat(50) })

    expect(filename).toBe(`collection-${'a'.repeat(40)}.json`)
    expect(filename).not.toContain('-.json')
  })
})
