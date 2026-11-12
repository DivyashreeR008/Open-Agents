import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HISTORY_LIMITS, useHistory } from './useHistory'

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

  it('bounds oversized output already present in storage', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        storedRun('old', { output: 'x'.repeat(HISTORY_LIMITS.outputCharacters + 5000) }),
      ])
    )

    const { result } = renderHook(() => useHistory())

    expect(result.current.history[0].output).toContain('Output truncated in history')
    expect(result.current.history[0].output.length).toBeLessThan(
      HISTORY_LIMITS.outputCharacters + 200
    )
  })
})

describe('useHistory recording', () => {
  it('adds the newest run first with a generated id and timestamp', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1700)
    localStorage.setItem(STORAGE_KEY, JSON.stringify([storedRun('older')]))
    const { result } = renderHook(() => useHistory())

    let outcome
    act(() => {
      outcome = result.current.saveRun({
        agentId: 'writer',
        agentName: 'Writer',
        provider: 'openai',
        inputs: { text: 'hello' },
        output: 'world',
      })
    })

    expect(outcome).toEqual({ ok: true, pruned: false })
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

  it('truncates long output and marks the stored copy as incomplete', () => {
    const { result } = renderHook(() => useHistory())
    const output = 'x'.repeat(HISTORY_LIMITS.outputCharacters + 100)

    act(() => {
      result.current.saveRun({ agentId: 'long', agentName: 'Long', output })
    })

    const stored = result.current.history[0]
    expect(stored.output).toContain('Output truncated in history')
    expect(stored.output.length).toBeGreaterThan(HISTORY_LIMITS.outputCharacters)
    expect(stored.output.length).toBeLessThan(HISTORY_LIMITS.outputCharacters + 200)
  })

  it('keeps the serialized history within the total character budget', () => {
    const { result } = renderHook(() => useHistory())
    const output = 'x'.repeat(HISTORY_LIMITS.outputCharacters)

    act(() => {
      for (let index = 0; index < 15; index += 1) {
        result.current.saveRun({ agentId: `large-${index}`, agentName: 'Large', output })
      }
    })

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored.length).toBeLessThanOrEqual(HISTORY_LIMITS.items)
    expect(JSON.stringify(stored).length).toBeLessThanOrEqual(HISTORY_LIMITS.totalCharacters)
    expect(stored[0].agentId).toBe('large-14')
  })

  it('falls back to the newest run when the merged list exceeds the quota', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const realSetItem = Storage.prototype.setItem
    localStorage.setItem(STORAGE_KEY, JSON.stringify([storedRun('old-1'), storedRun('old-2')]))
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function setItem(key, value) {
      if (key === STORAGE_KEY && value.length > 200) {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      }
      return realSetItem.call(this, key, value)
    })

    const { result } = renderHook(() => useHistory())
    let outcome
    act(() => {
      outcome = result.current.saveRun({ agentId: 'newest', agentName: 'Newest', output: 'saved' })
    })

    expect(outcome).toMatchObject({ ok: true, pruned: true })
    expect(result.current.history.map((run) => run.agentId)).toEqual(['newest'])
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).map((run) => run.agentId)).toEqual([
      'newest',
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
