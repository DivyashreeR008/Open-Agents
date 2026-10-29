import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  MAX_COLLECTIONS,
  uniqueCollectionName,
  useCollections,
} from './useCollections'
import { parseCollectionImport, serializeCollection } from './collectionTransfer'

function setup() {
  return renderHook(() => useCollections())
}

function custom(result) {
  return result.current.collections.filter((c) => c.id !== DEFAULT_COLLECTION_ID)
}

describe('uniqueCollectionName', () => {
  it('numbers repeated suffixes', () => {
    expect(uniqueCollectionName('Reads', ['Reads'], 'copy')).toBe('Reads (copy)')
    expect(uniqueCollectionName('Reads', ['Reads', 'reads (copy)'], 'copy')).toBe('Reads (copy 2)')
  })

  it('keeps the result within the name limit', () => {
    const long = 'x'.repeat(100)
    expect(uniqueCollectionName(long, [long], 'copy').length).toBeLessThanOrEqual(100)
  })
})

describe('duplicateCollection', () => {
  beforeEach(() => localStorage.clear())

  it('copies the name and agents into a new collection', () => {
    const { result } = setup()
    let id
    act(() => {
      id = result.current.createCollection('Reads').collection.id
      result.current.addAgentToCollection(id, 'a1')
      result.current.addAgentToCollection(id, 'a2')
    })

    let res
    act(() => {
      res = result.current.duplicateCollection(id)
    })

    expect(res.ok).toBe(true)
    expect(res.collection.id).not.toBe(id)
    expect(res.collection.name).toBe('Reads (copy)')
    expect(res.collection.agentIds).toEqual(['a1', 'a2'])
    expect(custom(result).map((c) => c.name)).toEqual(['Reads (copy)', 'Reads'])
    // the original is untouched
    expect(custom(result).find((c) => c.id === id).agentIds).toEqual(['a1', 'a2'])
  })

  it('refuses the default collection and unknown ids', () => {
    const { result } = setup()
    act(() => {
      expect(result.current.duplicateCollection(DEFAULT_COLLECTION_ID).ok).toBe(false)
      expect(result.current.duplicateCollection('nope').ok).toBe(false)
    })
    expect(custom(result)).toHaveLength(0)
  })

  it('stops at the collection limit without writing', () => {
    const { result } = setup()
    act(() => {
      for (let i = 0; i < MAX_COLLECTIONS; i += 1) result.current.createCollection(`C${i}`)
    })
    const before = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
    let res
    act(() => {
      res = result.current.duplicateCollection(custom(result)[0].id)
    })
    expect(res.ok).toBe(false)
    expect(localStorage.getItem(COLLECTIONS_STORAGE_KEY)).toBe(before)
  })
})

describe('importCollection', () => {
  beforeEach(() => localStorage.clear())

  it('round trips an exported collection into a fresh profile', () => {
    const source = setup()
    let id
    act(() => {
      id = source.result.current.createCollection('Launch').collection.id
      source.result.current.addAgentToCollection(id, 'a1')
      source.result.current.addAgentToCollection(id, 'b2')
    })
    const exported = serializeCollection(custom(source.result)[0])

    localStorage.clear()
    const target = setup()
    const parsed = parseCollectionImport(exported)
    let res
    act(() => {
      res = target.result.current.importCollection(parsed)
    })

    expect(res.ok).toBe(true)
    expect(custom(target.result)).toHaveLength(1)
    expect(custom(target.result)[0]).toMatchObject({
      name: 'Launch',
      agentIds: ['a1', 'b2'],
      isDefault: false,
    })
    expect(custom(target.result)[0].id).not.toBe(id)
    expect(JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY))).toHaveLength(2)
  })

  it('renames on a name clash instead of overwriting', () => {
    const { result } = setup()
    act(() => {
      result.current.createCollection('Launch')
    })
    let res
    act(() => {
      res = result.current.importCollection({ name: 'launch', agentIds: ['a1'] })
    })
    expect(res.ok).toBe(true)
    expect(res.collection.name).toBe('launch (imported)')
    expect(custom(result).map((c) => c.name).sort()).toEqual(['Launch', 'launch (imported)'])
  })

  it('does not write when the collection limit is reached', () => {
    const { result } = setup()
    act(() => {
      for (let i = 0; i < MAX_COLLECTIONS; i += 1) result.current.createCollection(`C${i}`)
    })
    const before = localStorage.getItem(COLLECTIONS_STORAGE_KEY)
    let res
    act(() => {
      res = result.current.importCollection({ name: 'More', agentIds: [] })
    })
    expect(res.ok).toBe(false)
    expect(localStorage.getItem(COLLECTIONS_STORAGE_KEY)).toBe(before)
  })

  it('never lets an import become or replace the default collection', () => {
    const { result } = setup()
    act(() => {
      result.current.importCollection({
        name: 'All Agents',
        agentIds: ['a1'],
        id: DEFAULT_COLLECTION_ID,
        isDefault: true,
      })
    })
    const defaults = result.current.collections.filter((c) => c.id === DEFAULT_COLLECTION_ID)
    expect(defaults).toHaveLength(1)
    expect(defaults[0].agentIds).toEqual([])
    expect(custom(result)).toHaveLength(1)
    expect(custom(result)[0].isDefault).toBe(false)
  })

  it('rejects a missing name', () => {
    const { result } = setup()
    let res
    act(() => {
      res = result.current.importCollection({ name: '  ', agentIds: [] })
    })
    expect(res.ok).toBe(false)
    expect(custom(result)).toHaveLength(0)
  })
})
