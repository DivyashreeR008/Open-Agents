import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { DEFAULT_COLLECTION_ID, MAX_AGENTS_PER_COLLECTION, useCollections } from './useCollections'

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
  return run(hook, (current) => current.createCollection(name)).collection
}

function fill(hook, collectionId, count, prefix = 'agent') {
  for (let i = 0; i < count; i += 1) {
    run(hook, (current) => current.addAgentToCollection(collectionId, `${prefix}-${i}`))
  }
}

beforeEach(() => localStorage.clear())

describe('useCollections move limits', () => {
  it('refuses to move an agent into a full target and keeps the source intact', () => {
    const hook = setup()
    const source = create(hook, 'Source')
    const target = create(hook, 'Target')
    run(hook, (current) => current.addAgentToCollection(source.id, 'a1'))
    fill(hook, target.id, MAX_AGENTS_PER_COLLECTION)

    const outcome = run(hook, (current) => current.moveAgentToCollection('a1', target.id))
    const current = Object.fromEntries(
      hook.result.current.collections.map((collection) => [collection.id, collection])
    )

    expect(outcome.ok).toBe(false)
    expect(outcome.error).toMatch(/up to/i)
    expect(current[source.id].agentIds).toContain('a1')
    expect(current[target.id].agentIds).not.toContain('a1')
  })

  it('protects the default collection and reports unknown delete targets', () => {
    const hook = setup()
    const before = hook.result.current.collections.map((collection) => collection.id)

    expect(run(hook, (current) => current.deleteCollection(DEFAULT_COLLECTION_ID)).ok).toBe(false)
    expect(run(hook, (current) => current.deleteCollection('missing')).ok).toBe(false)
    expect(run(hook, (current) => current.moveAgentToCollection('a1', 'missing')).ok).toBe(false)

    expect(hook.result.current.collections.map((collection) => collection.id)).toEqual(before)
  })

  it('tolerates missing ids for remove and membership helpers', () => {
    const hook = setup()
    const collection = create(hook, 'Reads')
    run(hook, (current) => current.addAgentToCollection(collection.id, 'a1'))

    expect(run(hook, (current) => current.removeAgentFromCollection('', 'a1')).ok).toBe(false)
    expect(run(hook, (current) => current.removeAgentFromCollection(collection.id, '')).ok).toBe(
      false
    )
    expect(hook.result.current.isAgentInCollection(collection.id, 'a1')).toBe(true)
    expect(hook.result.current.isAgentInCollection(collection.id, 'missing')).toBe(false)
    expect(hook.result.current.getCollectionById(DEFAULT_COLLECTION_ID).id).toBe(
      DEFAULT_COLLECTION_ID
    )
  })
})
