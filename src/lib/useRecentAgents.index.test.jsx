import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecentAgents } from './useRecentAgents'
import { useHistory } from './useHistory'

const HISTORY_KEY = 'OpenAgents_history'
const INDEX_KEY = 'oa_recent_agents'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('recent agents index', () => {
  it('reads the small index without reading run history', () => {
    localStorage.setItem(
      INDEX_KEY,
      JSON.stringify([{ id: 'a1', name: 'Indexed Agent', category: 'Research', lastUsedAt: 12 }])
    )
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([{ agentId: 'old', output: 'x'.repeat(50_000) }])
    )
    const getItem = Storage.prototype.getItem
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (key) {
      if (key === HISTORY_KEY) throw new Error('history should not be parsed')
      return getItem.call(this, key)
    })

    const { result } = renderHook(() => useRecentAgents())

    expect(result.current.recentAgents).toEqual([
      { id: 'a1', name: 'Indexed Agent', category: 'Research', lastUsedAt: 12 },
    ])
    expect(spy.mock.calls.some(([key]) => key === HISTORY_KEY)).toBe(false)
  })

  it('migrates existing history once, then clears both stores on request', () => {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([{ agentId: 'a1', agentName: 'Legacy Agent', timestamp: 5 }])
    )
    const { result } = renderHook(() => useRecentAgents())

    expect(result.current.recentAgents[0]).toMatchObject({ id: 'a1', name: 'Legacy Agent' })
    expect(JSON.parse(localStorage.getItem(INDEX_KEY))[0]).toMatchObject({ id: 'a1' })

    act(() => result.current.clearHistory())
    expect(localStorage.getItem(HISTORY_KEY)).toBeNull()
    expect(localStorage.getItem(INDEX_KEY)).toBeNull()
  })

  it('keeps the index in step with history saves, deletes, and clears', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveRun({
        runId: 'run-1',
        agentId: 'a1',
        agentName: 'Agent One',
        output: 'ok',
      })
    })
    expect(JSON.parse(localStorage.getItem(INDEX_KEY))[0]).toMatchObject({
      id: 'a1',
      name: 'Agent One',
    })

    act(() => result.current.deleteRun('run-1'))
    expect(JSON.parse(localStorage.getItem(INDEX_KEY))).toEqual([])

    act(() => {
      result.current.saveRun({
        runId: 'run-2',
        agentId: 'a2',
        agentName: 'Agent Two',
        output: 'ok',
      })
      result.current.clearHistory()
    })
    expect(localStorage.getItem(INDEX_KEY)).toBeNull()
  })
})
