import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
  MAX_AGENTS_PER_COLLECTION,
  MAX_COLLECTIONS,
  useCollections,
} from './useCollections'

function setup() {
  return renderHook(() => useCollections())
}

function run(hook, fn) {
  let result
  act(() => {
    result = fn(hook.result.current)
  })
  return result
}

function create(hook, name) {
  return run(hook, (c) => c.createCollection(name))
}

const find = (hook, id) => hook.result.current.collections.find((c) => c.id === id)

describe('useCollections editing', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('rename', () => {
    it('renames a collection and keeps its agents and other collections intact', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      const b = create(hook, 'Work').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      run(hook, (c) => c.addAgentToCollection(b.id, 'a2'))

      const result = run(hook, (c) => c.renameCollection(a.id, '  Reading list  '))

      expect(result.ok).toBe(true)
      expect(find(hook, a.id)).toMatchObject({ name: 'Reading list', agentIds: ['a1'] })
      expect(find(hook, b.id)).toMatchObject({ name: 'Work', agentIds: ['a2'] })
    })

    it('persists the new name to storage', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      run(hook, (c) => c.renameCollection(a.id, 'Renamed'))
      const stored = JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY))
      expect(stored.find((c) => c.id === a.id).name).toBe('Renamed')
    })

    it('rejects an empty or whitespace name and keeps the old one', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      expect(run(hook, (c) => c.renameCollection(a.id, '   ')).ok).toBe(false)
      expect(run(hook, (c) => c.renameCollection(a.id, undefined)).ok).toBe(false)
      expect(find(hook, a.id).name).toBe('Reads')
    })

    it('rejects a name used by another collection, ignoring case', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      create(hook, 'Work')
      const result = run(hook, (c) => c.renameCollection(a.id, 'WORK'))
      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/already exists/i)
      expect(find(hook, a.id).name).toBe('Reads')
    })

    it('allows renaming a collection to a different casing of its own name', () => {
      const hook = setup()
      const a = create(hook, 'reads').collection
      expect(run(hook, (c) => c.renameCollection(a.id, 'Reads')).ok).toBe(true)
      expect(find(hook, a.id).name).toBe('Reads')
    })

    it('does not rename the default collection', () => {
      const hook = setup()
      const result = run(hook, (c) => c.renameCollection(DEFAULT_COLLECTION_ID, 'Mine'))
      expect(result.ok).toBe(false)
      expect(find(hook, DEFAULT_COLLECTION_ID).name).toBe('All Agents')
    })
  })

  describe('add and move', () => {
    it('adds an agent to a collection without touching others', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      const b = create(hook, 'Work').collection
      run(hook, (c) => c.addAgentToCollection(b.id, 'a2'))

      const result = run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))

      expect(result.ok).toBe(true)
      expect(find(hook, a.id).agentIds).toEqual(['a1'])
      expect(find(hook, b.id).agentIds).toEqual(['a2'])
    })

    it('trims the agent id before storing it', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      run(hook, (c) => c.addAgentToCollection(a.id, '  a1  '))
      expect(find(hook, a.id).agentIds).toEqual(['a1'])
    })

    it('moves an agent out of its old collection and keeps the rest of it', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      const b = create(hook, 'Work').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      run(hook, (c) => c.addAgentToCollection(a.id, 'a2'))

      const result = run(hook, (c) => c.moveAgentToCollection('a1', b.id))

      expect(result.ok).toBe(true)
      expect(find(hook, a.id).agentIds).toEqual(['a2'])
      expect(find(hook, b.id).agentIds).toEqual(['a1'])
      expect(hook.result.current.getAgentCollectionId('a1')).toBe(b.id)
    })

    it('never leaves a moved agent in two collections', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      const b = create(hook, 'Work').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      run(hook, (c) => c.moveAgentToCollection('a1', b.id))
      const holders = hook.result.current.collections.filter((c) => c.agentIds.includes('a1'))
      expect(holders.map((c) => c.id)).toEqual([b.id])
    })

    it('reports bad input and unknown collections without changing data', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      const before = JSON.stringify(hook.result.current.collections)

      expect(run(hook, (c) => c.moveAgentToCollection('', a.id)).ok).toBe(false)
      expect(run(hook, (c) => c.moveAgentToCollection('a1', '')).ok).toBe(false)
      expect(run(hook, (c) => c.addAgentToCollection('missing', 'a1')).error).toMatch(/not found/i)
      expect(run(hook, (c) => c.addAgentToCollection(a.id, '   ')).ok).toBe(false)

      expect(JSON.stringify(hook.result.current.collections)).toBe(before)
    })

    it('refuses to add past the per-collection limit and keeps existing agents', () => {
      const hook = setup()
      const a = create(hook, 'Big').collection
      for (let i = 0; i < MAX_AGENTS_PER_COLLECTION; i += 1) {
        run(hook, (c) => c.addAgentToCollection(a.id, `agent-${i}`))
      }
      const result = run(hook, (c) => c.addAgentToCollection(a.id, 'one-too-many'))
      expect(result.ok).toBe(false)
      expect(find(hook, a.id).agentIds).toHaveLength(MAX_AGENTS_PER_COLLECTION)
      expect(find(hook, a.id).agentIds).not.toContain('one-too-many')
    })
  })

  describe('duplicates', () => {
    it('does not add the same agent to a collection twice', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      const result = run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/already in/i)
      expect(find(hook, a.id).agentIds).toEqual(['a1'])
    })

    it('treats moving an agent into the collection it is already in as a no-op', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      expect(run(hook, (c) => c.moveAgentToCollection('a1', a.id)).ok).toBe(false)
      expect(find(hook, a.id).agentIds).toEqual(['a1'])
    })

    it('rejects duplicate collection names ignoring case and surrounding spaces', () => {
      const hook = setup()
      create(hook, 'Reads')
      const result = create(hook, '  reads ')
      expect(result.ok).toBe(false)
      expect(result.error).toMatch(/already exists/i)
      expect(
        hook.result.current.collections.filter((c) => c.name.toLowerCase() === 'reads')
      ).toHaveLength(1)
    })

    it('drops duplicate agent ids found in stored data when loading', () => {
      localStorage.setItem(
        COLLECTIONS_STORAGE_KEY,
        JSON.stringify([{ id: 'c1', name: 'Reads', agentIds: ['a1', 'a1', ' a1 ', 'a2', ''] }])
      )
      const hook = setup()
      expect(find(hook, 'c1').agentIds).toEqual(['a1', 'a2'])
    })

    it('stops creating collections at the limit', () => {
      const hook = setup()
      for (let i = 0; i < MAX_COLLECTIONS; i += 1) create(hook, `Set ${i}`)
      const result = create(hook, 'Extra')
      expect(result.ok).toBe(false)
      expect(
        hook.result.current.collections.filter((c) => c.id !== DEFAULT_COLLECTION_ID)
      ).toHaveLength(MAX_COLLECTIONS)
    })
  })

  describe('empty states', () => {
    it('starts with only the empty default collection', () => {
      const hook = setup()
      expect(hook.result.current.collections).toHaveLength(1)
      expect(find(hook, DEFAULT_COLLECTION_ID)).toMatchObject({ agentIds: [], isDefault: true })
    })

    it('creates new collections empty', () => {
      const hook = setup()
      expect(create(hook, 'Reads').collection.agentIds).toEqual([])
    })

    it('can be renamed and filled while empty', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      expect(run(hook, (c) => c.renameCollection(a.id, 'Later')).ok).toBe(true)
      expect(run(hook, (c) => c.addAgentToCollection(a.id, 'a1')).ok).toBe(true)
      expect(find(hook, a.id)).toMatchObject({ name: 'Later', agentIds: ['a1'] })
    })

    it('keeps a collection after its last agent is removed', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      run(hook, (c) => c.removeAgentFromCollection(a.id, 'a1'))
      expect(find(hook, a.id)).toMatchObject({ name: 'Reads', agentIds: [] })
    })

    it('returns the default collection for an agent that is in none', () => {
      const hook = setup()
      expect(hook.result.current.getAgentCollectionId('nobody')).toBe(DEFAULT_COLLECTION_ID)
      expect(hook.result.current.getAgentCollectionId('')).toBe(DEFAULT_COLLECTION_ID)
    })

    it('falls back to the empty default when stored data is corrupt', () => {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, '{not json')
      const hook = setup()
      expect(hook.result.current.collections.map((c) => c.id)).toEqual([DEFAULT_COLLECTION_ID])
    })

    it('returns agents to the default collection when their collection is deleted', () => {
      const hook = setup()
      const a = create(hook, 'Reads').collection
      run(hook, (c) => c.addAgentToCollection(a.id, 'a1'))
      run(hook, (c) => c.deleteCollection(a.id))
      expect(find(hook, a.id)).toBeUndefined()
      expect(find(hook, DEFAULT_COLLECTION_ID).agentIds).toEqual(['a1'])
    })
  })
})
