import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHistory } from './useHistory'
import { usePromptHistory } from './usePromptHistory'
import { useFavorites } from './useFavorites'
import { useRecentAgents } from './useRecentAgents'
import {
  useCollections,
  loadCollections,
  saveCollections,
  COLLECTIONS_STORAGE_KEY,
  DEFAULT_COLLECTION_ID,
} from './useCollections'
import {
  fireStorageEvent,
  simulateQuotaExceeded,
  simulateStorageDisabled,
} from '../test/storageFailures'

const HISTORY_KEY = 'OpenAgents_history'
const PROMPTS_KEY = 'oa_prompt_history'
const FAVORITES_KEY = 'oa_favorites'

const run = (agentId) => ({ agentId, agentName: agentId, inputs: {}, output: 'ok' })

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  localStorage.clear()
})

describe('useHistory storage failures', () => {
  it('keeps the in-memory run when the quota is exceeded and does not throw', () => {
    simulateQuotaExceeded()
    const { result } = renderHook(() => useHistory())

    expect(() => act(() => result.current.saveRun(run('writer')))).not.toThrow()
    expect(result.current.history).toHaveLength(1)
    expect(localStorage.getItem(HISTORY_KEY)).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })

  it('starts empty and stays usable when storage is disabled', () => {
    simulateStorageDisabled()
    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual([])
    expect(() => act(() => result.current.saveRun(run('writer')))).not.toThrow()
    expect(() => act(() => result.current.clearHistory())).not.toThrow()
    expect(result.current.history).toEqual([])
  })

  it('starts empty when the stored value is malformed JSON', () => {
    localStorage.setItem(HISTORY_KEY, '{not json')
    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual([])
    act(() => result.current.saveRun(run('writer')))
    expect(result.current.history).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY))).toHaveLength(1)
  })

  it('starts empty when nothing has been stored', () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current.history).toEqual([])
  })

  it('merges with a run written by another tab instead of overwriting it', () => {
    const { result } = renderHook(() => useHistory())
    const other = { id: 'other_1', agentId: 'other', timestamp: 1 }
    localStorage.setItem(HISTORY_KEY, JSON.stringify([other]))

    act(() => result.current.saveRun(run('writer')))

    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY))
    expect(stored.map((r) => r.agentId)).toEqual(['writer', 'other'])
  })

  it('resyncs when another tab changes the key, and ignores other keys', () => {
    const { result } = renderHook(() => useHistory())
    const other = { id: 'other_1', agentId: 'other', timestamp: 1 }
    localStorage.setItem(HISTORY_KEY, JSON.stringify([other]))

    act(() => fireStorageEvent('something_else', null))
    expect(result.current.history).toEqual([])

    act(() => fireStorageEvent(HISTORY_KEY, JSON.stringify([other])))
    expect(result.current.history).toEqual([other])
  })

  it('falls back to empty when another tab leaves corrupt data behind', () => {
    const { result } = renderHook(() => useHistory())
    act(() => result.current.saveRun(run('writer')))

    localStorage.setItem(HISTORY_KEY, 'garbage')
    act(() => fireStorageEvent(HISTORY_KEY, 'garbage'))

    expect(result.current.history).toEqual([])
  })
})

describe('usePromptHistory storage failures', () => {
  it('stays consistent with storage (no phantom prompt) when the quota is exceeded', () => {
    simulateQuotaExceeded()
    const { result } = renderHook(() => usePromptHistory())

    expect(() => act(() => result.current.savePrompt({ text: 'hello' }))).not.toThrow()
    // notify() resyncs from storage, so the unsaved prompt is not shown
    expect(result.current.prompts).toEqual([])
    expect(localStorage.getItem(PROMPTS_KEY)).toBeNull()
    expect(console.error).toHaveBeenCalledWith(
      'LocalStorage quota exceeded. Prompt history might be truncated.',
    )
  })

  it('works without throwing when storage is disabled', () => {
    simulateStorageDisabled()
    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.prompts).toEqual([])
    expect(() => act(() => result.current.savePrompt({ text: 'hello' }))).not.toThrow()
    expect(() => act(() => result.current.clearHistory())).not.toThrow()
  })

  it('starts empty on malformed JSON and recovers on the next save', () => {
    localStorage.setItem(PROMPTS_KEY, '][')
    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.prompts).toEqual([])
    act(() => result.current.savePrompt({ text: 'fresh' }))
    expect(JSON.parse(localStorage.getItem(PROMPTS_KEY))).toHaveLength(1)
  })

  it('picks up a prompt saved by another tab via the storage event', () => {
    const { result } = renderHook(() => usePromptHistory())
    const entry = { id: 'p1', text: 'from tab 2', favorite: false, createdAt: 1 }
    localStorage.setItem(PROMPTS_KEY, JSON.stringify([entry]))

    act(() => fireStorageEvent(PROMPTS_KEY, JSON.stringify([entry])))

    expect(result.current.prompts).toEqual([entry])
  })

  it('does not drop a prompt another tab wrote before this save', () => {
    const { result } = renderHook(() => usePromptHistory())
    const entry = { id: 'p1', text: 'from tab 2', favorite: false, createdAt: 1 }
    localStorage.setItem(PROMPTS_KEY, JSON.stringify([entry]))

    act(() => result.current.savePrompt({ text: 'from tab 1' }))

    const texts = JSON.parse(localStorage.getItem(PROMPTS_KEY)).map((p) => p.text)
    expect(texts).toEqual(['from tab 1', 'from tab 2'])
  })
})

describe('useFavorites storage failures', () => {
  it('starts empty and ignores toggles when storage is disabled', () => {
    simulateStorageDisabled()
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
    act(() => result.current.toggleFavorite('a'))
    expect(result.current.favorites).toEqual([])
  })

  it('keeps state unchanged when the quota is exceeded', () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(['a']))
    const { result } = renderHook(() => useFavorites())
    simulateQuotaExceeded()

    act(() => result.current.toggleFavorite('b'))

    expect(result.current.favorites).toEqual(['a'])
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual(['a'])
  })

  it('starts empty on malformed JSON and recovers on the next toggle', () => {
    localStorage.setItem(FAVORITES_KEY, '{oops')
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
    act(() => result.current.toggleFavorite('a'))
    expect(result.current.favorites).toEqual(['a'])
    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual(['a'])
  })

  it('toggles against the latest stored list, not stale state', () => {
    const { result } = renderHook(() => useFavorites())
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(['from-other-tab']))

    act(() => result.current.toggleFavorite('a'))

    expect(JSON.parse(localStorage.getItem(FAVORITES_KEY))).toEqual([
      'a',
      'from-other-tab',
    ])
  })
})

describe('useRecentAgents storage failures', () => {
  it('returns an empty list when storage is disabled', () => {
    simulateStorageDisabled()
    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([])
    expect(() => act(() => result.current.clearHistory())).not.toThrow()
  })

  it.each([
    ['malformed JSON', '{nope'],
    ['a non-array value', '{"agentId":"x"}'],
    ['null', 'null'],
  ])('returns an empty list for %s', (_label, value) => {
    localStorage.setItem(HISTORY_KEY, value)
    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents).toEqual([])
  })

  it('skips entries without an agentId and keeps the valid ones', () => {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([null, { foo: 1 }, { agentId: 'a', timestamp: 5 }]),
    )
    const { result } = renderHook(() => useRecentAgents())
    expect(result.current.recentAgents.map((r) => r.id)).toEqual(['a'])
  })

  it('updates when another tab changes the history key', () => {
    const { result } = renderHook(() => useRecentAgents())
    localStorage.setItem(HISTORY_KEY, JSON.stringify([{ agentId: 'a', timestamp: 1 }]))

    act(() => fireStorageEvent(HISTORY_KEY, 'x'))

    expect(result.current.recentAgents.map((r) => r.id)).toEqual(['a'])
  })
})

describe('collections storage failures', () => {
  const defaultOnly = (collections) => {
    expect(collections).toHaveLength(1)
    expect(collections[0].id).toBe(DEFAULT_COLLECTION_ID)
  }

  it('loads only the default collection when storage is disabled', () => {
    simulateStorageDisabled()
    defaultOnly(loadCollections())
  })

  it.each([
    ['malformed JSON', '{bad'],
    ['a non-array value', '{"a":1}'],
    ['null', 'null'],
  ])('falls back to the default collection for %s', (_label, value) => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, value)
    defaultOnly(loadCollections())
  })

  it('drops invalid collection entries and keeps valid ones', () => {
    localStorage.setItem(
      COLLECTIONS_STORAGE_KEY,
      JSON.stringify([null, 42, { id: 'c1', name: 'Mine', agentIds: ['a'] }]),
    )
    const ids = loadCollections().map((c) => c.id)
    expect(ids).toEqual([DEFAULT_COLLECTION_ID, 'c1'])
  })

  it('surfaces the quota error from saveCollections so callers can react', () => {
    simulateQuotaExceeded()
    expect(() => saveCollections([])).toThrow(/quota/i)
  })

  it('hook initial state falls back to the default collection on corrupt data', () => {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, 'nope')
    const { result } = renderHook(() => useCollections())
    defaultOnly(result.current.collections)
  })
})
