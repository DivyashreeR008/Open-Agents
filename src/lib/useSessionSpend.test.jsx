import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionSpend } from './useSessionSpend'
import { fireStorageEvent } from '../test/storageFailures'

const STORAGE_KEY = 'oa_session_spend'

const storedRun = (id, overrides = {}) => ({
  id,
  model: 'gpt-4o',
  inputTokens: 1000,
  outputTokens: 500,
  inputCost: 0.25,
  outputCost: 0.1,
  totalCost: 0.35,
  timestamp: 1,
  ...overrides,
})

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useSessionSpend loading', () => {
  it('starts with an empty session', () => {
    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toEqual([])
    expect(result.current.totalSpend).toBe(0)
  })

  it('reloads runs and recomputes the total instead of trusting a stale one', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        runs: [storedRun('a'), storedRun('b', { inputCost: 0.2, outputCost: 0.3, totalCost: 9 })],
        totalSpend: 9999,
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs.map((run) => run.id)).toEqual(['a', 'b'])
    expect(result.current.runs[1].totalCost).toBeCloseTo(0.5, 10)
    expect(result.current.totalSpend).toBeCloseTo(0.85, 10)
  })

  it('preserves a cumulative total after run history has been capped', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        startedAt: 111,
        runs: [storedRun('retained')],
        totalSpend: 99,
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(1)
    expect(result.current.totalSpend).toBe(99)
    expect(result.current.startedAt).toBe(111)
  })

  it('records a start point with the first run and writes the cumulative format', () => {
    vi.spyOn(Date, 'now').mockReturnValue(4321)
    const { result } = renderHook(() => useSessionSpend())

    act(() => {
      result.current.addRun({
        model: 'gpt-4o',
        inputTokens: 1,
        outputTokens: 1,
        inputCost: 0.1,
        outputCost: 0.2,
      })
    })

    expect(result.current.startedAt).toBe(4321)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored.version).toBe(2)
    expect(stored.startedAt).toBe(4321)
    expect(stored.totalSpend).toBeCloseTo(0.3, 10)
  })

  it('normalizes invalid token and cost fields and drops non-record runs', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        runs: [
          null,
          42,
          storedRun('valid', {
            inputTokens: 'not-a-number',
            outputTokens: -5,
            inputCost: -1,
            outputCost: 'bad',
            totalCost: 1.25,
          }),
        ],
        totalSpend: 'corrupt',
      })
    )

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(1)
    expect(result.current.runs[0]).toMatchObject({
      id: 'valid',
      inputTokens: 0,
      outputTokens: 0,
      inputCost: 0,
      outputCost: 0,
      totalCost: 1.25,
    })
    expect(result.current.totalSpend).toBe(1.25)
  })

  it.each([
    ['malformed JSON', '{not-json'],
    ['a non-object value', '[]'],
    ['missing runs', JSON.stringify({ totalSpend: 4 })],
    ['non-array runs', JSON.stringify({ runs: { a: 1 } })],
  ])('treats %s as an empty session', (_label, value) => {
    localStorage.setItem(STORAGE_KEY, value)

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toEqual([])
    expect(result.current.totalSpend).toBe(0)
  })

  it('keeps only the newest two hundred stored runs', () => {
    const runs = Array.from({ length: 201 }, (_, index) => storedRun(`run-${index}`))
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runs, totalSpend: 201 }))

    const { result } = renderHook(() => useSessionSpend())

    expect(result.current.runs).toHaveLength(200)
    expect(result.current.runs[0].id).toBe('run-0')
    expect(result.current.runs.at(-1).id).toBe('run-199')
    expect(result.current.totalSpend).toBeCloseTo(70, 10)
  })
})

describe('useSessionSpend recording', () => {
  it('estimates both sides from token counts when no costs are supplied', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1234)
    const { result } = renderHook(() => useSessionSpend())

    act(() => {
      result.current.addRun({
        model: 'gpt-4o-mini',
        inputTokens: 1_000_000,
        outputTokens: 1_000_000,
      })
    })

    expect(result.current.runs[0]).toMatchObject({
      model: 'gpt-4o-mini',
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
      timestamp: 1234,
    })
    expect(result.current.runs[0].inputCost).toBeCloseTo(0.15, 10)
    expect(result.current.runs[0].outputCost).toBeCloseTo(0.6, 10)
    expect(result.current.runs[0].totalCost).toBeCloseTo(0.75, 10)
    expect(result.current.totalSpend).toBeCloseTo(0.75, 10)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).totalSpend).toBeCloseTo(0.75, 10)
  })

  it('respects explicit zero costs instead of replacing them with estimates', () => {
    const { result } = renderHook(() => useSessionSpend())

    act(() => {
      result.current.addRun({
        model: 'gpt-4o',
        inputTokens: 1_000_000,
        outputTokens: 1_000_000,
        inputCost: 0,
        outputCost: 0,
      })
    })

    expect(result.current.runs[0].totalCost).toBe(0)
    expect(result.current.totalSpend).toBe(0)
  })

  it('estimates only the side whose cost was omitted', () => {
    const { result } = renderHook(() => useSessionSpend())

    act(() => {
      result.current.addRun({
        model: 'gpt-4o',
        inputTokens: 1_000_000,
        outputTokens: 1_000_000,
        inputCost: 1,
      })
    })

    expect(result.current.runs[0].inputCost).toBe(1)
    expect(result.current.runs[0].outputCost).toBeCloseTo(10, 10)
    expect(result.current.runs[0].totalCost).toBeCloseTo(11, 10)
  })

  it('records zero usage and zero cost when the inputs are missing or invalid', () => {
    const { result } = renderHook(() => useSessionSpend())

    act(() => {
      result.current.addRun({
        model: 'unknown-model',
        inputTokens: -10,
        outputTokens: 'bad',
        inputCost: Number.NaN,
        outputCost: -2,
      })
    })

    expect(result.current.runs[0]).toMatchObject({
      inputTokens: 0,
      outputTokens: 0,
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
    })
  })

  it('caps the stored runs while keeping dropped runs in the cumulative total', () => {
    const previous = Array.from({ length: 200 }, (_, index) =>
      storedRun(`old-${index}`, { inputCost: 1, outputCost: 0, totalCost: 1 })
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runs: previous, totalSpend: 200 }))
    const { result } = renderHook(() => useSessionSpend())

    act(() => {
      result.current.addRun({
        model: 'gpt-4o',
        inputTokens: 0,
        outputTokens: 0,
        inputCost: 2,
        outputCost: 0,
      })
    })

    expect(result.current.runs).toHaveLength(200)
    expect(result.current.runs[0].totalCost).toBe(2)
    expect(result.current.runs.at(-1).id).toBe('old-198')
    expect(result.current.totalSpend).toBeCloseTo(202, 10)
  })

  it('merges a run written by another tab after this hook mounted', () => {
    const { result } = renderHook(() => useSessionSpend())
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ runs: [storedRun('other')], totalSpend: 0.35 })
    )

    act(() => {
      result.current.addRun({ model: 'gpt-4o', inputCost: 0.5, outputCost: 0 })
    })

    expect(result.current.runs).toHaveLength(2)
    expect(result.current.runs[0].totalCost).toBe(0.5)
    expect(result.current.runs[1].id).toBe('other')
    expect(result.current.totalSpend).toBeCloseTo(0.85, 10)
  })

  it('resyncs when another tab writes the session key', () => {
    const { result } = renderHook(() => useSessionSpend())
    const other = storedRun('from-other-tab')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runs: [other], totalSpend: 0.35 }))

    act(() => fireStorageEvent(STORAGE_KEY, 'changed'))

    expect(result.current.runs.map((run) => run.id)).toEqual(['from-other-tab'])
    expect(result.current.totalSpend).toBeCloseTo(0.35, 10)
  })

  it('clears runs, total, and stored data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runs: [storedRun('a')], totalSpend: 0.35 }))
    const { result } = renderHook(() => useSessionSpend())

    act(() => result.current.clearSession())

    expect(result.current.runs).toEqual([])
    expect(result.current.totalSpend).toBe(0)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
