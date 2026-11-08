import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCollections, DEFAULT_COLLECTION_ID } from './useCollections'

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

beforeEach(() => {
  localStorage.clear()
})

describe('useCollections non-string inputs', () => {
  it('rejects non-string names without writing a collection', () => {
    const hook = setup()
    const created = run(hook, (collections) => collections.createCollection(42))
    expect(created).toEqual({ ok: false, error: 'Collection name is required.' })

    const collection = run(hook, (collections) => collections.createCollection('Reads')).collection
    const renamed = run(hook, (collections) => collections.renameCollection(collection.id, 42))
    expect(renamed).toEqual({ ok: false, error: 'Collection name is required.' })
  })

  it('rejects non-string agent ids for add and move operations', () => {
    const hook = setup()
    const collection = run(hook, (collections) => collections.createCollection('Reads')).collection

    expect(run(hook, (collections) => collections.addAgentToCollection(collection.id, 42))).toEqual(
      {
        ok: false,
        error: 'Agent is required.',
      }
    )
    expect(
      run(hook, (collections) => collections.moveAgentToCollection(42, collection.id))
    ).toEqual({
      ok: false,
      error: 'Agent is required.',
    })
  })

  it('treats a non-string agent id as outside every collection', () => {
    const hook = setup()
    const collection = run(hook, (collections) => collections.createCollection('Reads')).collection
    run(hook, (collections) => collections.addAgentToCollection(collection.id, 'a1'))

    expect(run(hook, (collections) => collections.getAgentCollectionId(42))).toBe(
      DEFAULT_COLLECTION_ID
    )
    expect(run(hook, (collections) => collections.isAgentInCollection(collection.id, 42))).toBe(
      false
    )
  })

  it('drops a non-array agent list when importing a collection', () => {
    const hook = setup()
    const result = run(hook, (collections) =>
      collections.importCollection({ name: 'Imported', agentIds: 'a1,a2' })
    )

    expect(result.ok).toBe(true)
    expect(result.collection.agentIds).toEqual([])
  })
})
