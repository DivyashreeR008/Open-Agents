import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { fireStorageEvent } from '../test/storageFailures'
import { useSessionSpend } from './useSessionSpend'
import { costSourceLabel, readCostProvenance, resolveCostComponent } from './spendProvenance'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

it('keeps a real reported zero distinct from an estimate and missing usage', () => {
  const { result } = renderHook(() => useSessionSpend())
  act(() => result.current.addRun({ model: 'gpt-4o', inputCost: 0, outputCost: 0 }))
  expect(result.current.runs[0].costProvenance).toEqual({
    version: 1,
    input: 'reported',
    output: 'reported',
  })
  expect(result.current.costSummary).toMatchObject({
    reportedComponents: 2,
    estimatedComponents: 0,
    unknownComponents: 0,
  })
  expect(costSourceLabel(result.current.runs[0])).toBe('Reported')
})

it('labels token-based money as estimated even when both token counts are available', () => {
  const { result } = renderHook(() => useSessionSpend())
  act(() =>
    result.current.addRun({ model: 'gpt-4o-mini', inputTokens: 1_000_000, outputTokens: 1_000_000 })
  )
  expect(result.current.runs[0].costProvenance).toEqual({
    version: 1,
    input: 'estimated',
    output: 'estimated',
  })
  expect(result.current.costSummary.estimated).toBeCloseTo(0.75)
  expect(result.current.costSummary.reported).toBe(0)
})

it('discloses mixed components and omitted costs without silently counting them as free', () => {
  const { result } = renderHook(() => useSessionSpend())
  act(() => {
    result.current.addRun({ model: 'gpt-4o', inputCost: 1, outputTokens: 1_000_000 })
    result.current.addRun({ model: 'unknown-model', inputTokens: 1200, outputTokens: 800 })
  })
  expect(result.current.totalSpend).toBe(11)
  expect(result.current.costSummary).toMatchObject({
    reported: 1,
    estimated: 10,
    unknownComponents: 2,
  })
  expect(costSourceLabel(result.current.runs[1])).toBe('Mixed')
  expect(costSourceLabel(result.current.runs[0])).toBe('Source unknown')
})

it('labels a partial receipt incomplete and persists provenance through reload and cross-tab events', () => {
  const { result, unmount } = renderHook(() => useSessionSpend())
  act(() => result.current.addRun({ model: 'gpt-4o', inputCost: 2, outputTokens: null }))
  expect(costSourceLabel(result.current.runs[0])).toBe('Reported, incomplete')
  unmount()
  const restored = renderHook(() => useSessionSpend())
  expect(restored.result.current.costSummary).toMatchObject({ reported: 2, unknownComponents: 1 })
  localStorage.setItem('oa_session_spend', JSON.stringify({ runs: [] }))
  act(() => fireStorageEvent('oa_session_spend', 'changed'))
  expect(restored.result.current.costSummary).toMatchObject({ reported: 0, unknownComponents: 0 })
})

it('preserves legacy amounts as unattributed without inferring receipts or repricing history', () => {
  localStorage.setItem(
    'oa_session_spend',
    JSON.stringify({
      runs: [
        {
          model: 'gpt-4o',
          inputCost: 0.1,
          outputCost: 0.2,
          totalCost: 0.3,
          inputTokens: 10,
          outputTokens: 5,
        },
        { totalCost: 1.25 },
      ],
      totalSpend: 9999,
    })
  )
  const { result } = renderHook(() => useSessionSpend())
  expect(result.current.totalSpend).toBeCloseTo(1.55)
  expect(result.current.costSummary).toMatchObject({
    reported: 0,
    estimated: 0,
    unknownComponents: 4,
  })
  expect(result.current.costSummary.unattributed).toBeCloseTo(1.55)
  expect(result.current.runs.every((run) => costSourceLabel(run) === 'Source unknown')).toBe(true)
})

it('distinguishes an explicit zero token count from missing, non-finite or negative usage', () => {
  expect(resolveCostComponent('gpt-4o', 0, null, 'input')).toEqual({ cost: 0, source: 'estimated' })
  for (const tokens of [undefined, null, '100', -1, NaN, Infinity]) {
    expect(resolveCostComponent('gpt-4o', tokens, null, 'input')).toEqual({
      cost: 0,
      source: 'unknown',
    })
  }
  expect(resolveCostComponent('unpriced', 100, 0, 'input')).toEqual({ cost: 0, source: 'reported' })
})

it('rejects malformed stored provenance rather than treating legacy or invalid values as receipts', () => {
  expect(readCostProvenance({ costProvenance: { version: 2, input: 'reported' } }).input).toBe(
    'unknown'
  )
  expect(
    readCostProvenance({
      inputCost: 'bad',
      outputCost: 1,
      costProvenance: { version: 1, input: 'reported', output: 'invented' },
    })
  ).toEqual({ version: 1, input: 'unknown', output: 'unknown' })
})
