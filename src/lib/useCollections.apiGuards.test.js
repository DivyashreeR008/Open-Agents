import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { COLLECTIONS_STORAGE_KEY, saveCollections, useCollections } from './useCollections'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  localStorage.clear()
})

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

describe('collection storage and API guards', () => {
  it('writes the default collection when asked to save a non-array', () => {
    saveCollections(null)

    const stored = JSON.parse(localStorage.getItem(COLLECTIONS_STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({
      id: 'all-agents',
      name: 'All Agents',
      isDefault: true,
    })
  })

  it('creates a fallback id when crypto.randomUUID is unavailable', () => {
    vi.stubGlobal('crypto', { ...globalThis.crypto, randomUUID: undefined })

    const hook = setup()
    const result = run(hook, (collections) => collections.createCollection('Reads'))

    expect(result.ok).toBe(true)
    expect(result.collection.id).toMatch(/^collection-\d+-[a-z0-9]+$/)
  })

  it('rejects a missing collection id before touching storage', () => {
    const hook = setup()

    expect(run(hook, (collections) => collections.addAgentToCollection('', 'a1'))).toEqual({
      ok: false,
      error: 'Collection and agent are required.',
    })
    expect(run(hook, (collections) => collections.removeAgentFromCollection('', 'a1'))).toEqual({
      ok: false,
      error: 'Collection and agent are required.',
    })
  })
})
