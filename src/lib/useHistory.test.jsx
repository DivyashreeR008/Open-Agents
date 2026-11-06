import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHistory } from './useHistory'

const STORAGE_KEY = 'OpenAgents_history'

const storedRun = (id, overrides = {}) => ({
  id,
  agentId: id,
  agentName: `Agent ${id}`,
  provider: 'openai',
  output: 'done',
  timestamp: 1,
  ...overrides,
})

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useHistory loading', () => {
  it('returns stored runs in their persisted order', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([storedRun('newer', { timestamp: 2 }), storedRun('older', { timestamp: 1 })])
    )

    const { result } = renderHook(() => useHistory())

    expect(result.current.history.map((run) => run.id)).toEqual(['newer', 'older'])
  })

  it('drops nulls, primitives, and arrays while keeping valid records', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([null, 42, 'run', ['nested'], storedRun('valid')])
    )

    const { result } = renderHook(() => useHistory())

    expect(result.current.history.map((run) => run.id)).toEqual(['valid'])
  })

  it('treats a stored object as empty history instead of exposing a non-array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 'not-a-list' }))

    const { result } = renderHook(() => useHistory())

    expect(result.current.history).toEqual([])
    expect(() => act(() => result.current.deleteRun('anything'))).not.toThrow()
  })
})

describe('useHistory recording', () => {
  it('adds the newest run first with a generated id and timestamp', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([storedRun('older')]))
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveRun({
        agentId: 'writer',
        agentName: 'Writer',
        provider: 'openai',
        inputs: { text: 'hello' },
        output: 'world',
      })
    })

    expect(result.current.history[0]).toMatchObject({
      id: 'writer_1700',
      agentId: 'writer',
      timestamp: 1700,
      output: 'world',
    })
    expect(result.current.history[1].id).toBe('older')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).map((run) => run.id)).toEqual([
      'writer_1700',
      'older',
    ])
  })

  it('uses a supplied run id without storing it as a duplicate field', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveRun({
        runId: 'shared-id',
        agentId: 'writer',
        agentName: 'Writer',
      })
    })

    expect(result.current.history[0].id).toBe('shared-id')
    expect(result.current.history[0].runId).toBeUndefined()
  })

  it('removes credential-shaped fields at every nesting depth before persisting', () => {
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveRun({
        agentId: 'writer',
        agentName: 'Writer',
        apiKey: 'sk-live',
        inputs: {
          text: 'keep me',
          token: 'secret-token',
          nested: { password: 'hunter2', note: 'keep this' },
        },
        output: 'done',
      })
    })

    const run = result.current.history[0]
    expect(run.apiKey).toBeUndefined()
    expect(run.inputs.text).toBe('keep me')
    expect(run.inputs.token).toBeUndefined()
    expect(run.inputs.nested.password).toBeUndefined()
    expect(run.inputs.nested.note).toBe('keep this')
    expect(JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_KEY)))).not.toMatch(
      /sk-live|secret-token|hunter2/
    )
  })

  it('caps history at ten runs and removes the oldest entry', () => {
    const existing = Array.from({ length: 10 }, (_, index) =>
      storedRun(`old-${index}`, { timestamp: 100 - index })
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    const { result } = renderHook(() => useHistory())

    act(() => {
      result.current.saveRun({ agentId: 'newest', agentName: 'Newest' })
    })

    expect(result.current.history).toHaveLength(10)
    expect(result.current.history[0].agentId).toBe('newest')
    expect(result.current.history.map((run) => run.id)).not.toContain('old-9')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(10)
  })

  it('merges with a run written after this hook mounted instead of overwriting it', () => {
    const { result } = renderHook(() => useHistory())
    localStorage.setItem(STORAGE_KEY, JSON.stringify([storedRun('other-tab', { timestamp: 1 })]))

    act(() => {
      result.current.saveRun({ runId: 'this-tab', agentId: 'this', agentName: 'This tab' })
    })

    expect(result.current.history.map((run) => run.id)).toEqual(['this-tab', 'other-tab'])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).map((run) => run.id)).toEqual([
      'this-tab',
      'other-tab',
    ])
  })
})

describe('useHistory deletion and clearing', () => {
  it('deletes only the matching run from state and storage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([storedRun('keep'), storedRun('remove')]))
    const { result } = renderHook(() => useHistory())

    act(() => result.current.deleteRun('remove'))

    expect(result.current.history.map((run) => run.id)).toEqual(['keep'])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).map((run) => run.id)).toEqual(['keep'])
  })

  it('leaves history untouched when the requested run is absent', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([storedRun('keep')]))
    const { result } = renderHook(() => useHistory())

    act(() => result.current.deleteRun('missing'))

    expect(result.current.history.map((run) => run.id)).toEqual(['keep'])
  })

  it('clears both in-memory history and the stored list', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([storedRun('a'), storedRun('b')]))
    const { result } = renderHook(() => useHistory())

    act(() => result.current.clearHistory())

    expect(result.current.history).toEqual([])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual([])
    expect(result.current.getHistory()).toEqual([])
  })
})
