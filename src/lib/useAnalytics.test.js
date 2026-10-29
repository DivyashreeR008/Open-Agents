import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { allocateRoundedPercentages, recordAnalyticsRun, useAnalytics } from './useAnalytics'
import { useHistory } from './useHistory'

describe('allocateRoundedPercentages', () => {
  it('reconciles three equal shares to exactly one hundred', () => {
    const result = allocateRoundedPercentages([
      { name: 'a', count: 1 },
      { name: 'b', count: 1 },
      { name: 'c', count: 1 },
    ])

    expect(result.map((item) => item.pct)).toEqual([34, 33, 33])
  })

  it('handles empty and single-item distributions', () => {
    expect(allocateRoundedPercentages([])).toEqual([])
    expect(allocateRoundedPercentages([{ name: 'only', count: 7 }])).toEqual([
      { name: 'only', count: 7, pct: 100 },
    ])
  })

  it('corrects cases where independent rounding would exceed one hundred', () => {
    const result = allocateRoundedPercentages([
      { name: 'a', count: 2 },
      { name: 'b', count: 2 },
      { name: 'c', count: 2 },
      { name: 'd', count: 1 },
    ])

    expect(result.reduce((sum, item) => sum + item.pct, 0)).toBe(100)
    expect(result.map((item) => item.pct)).toEqual([29, 29, 28, 14])
  })

  it('always sums positive sample distributions to one hundred', () => {
    const samples = [
      [1, 2],
      [5, 4, 3, 2, 1],
      [99, 1, 1],
      [7, 7, 7, 7, 7, 7],
    ]

    for (const counts of samples) {
      const result = allocateRoundedPercentages(
        counts.map((count, index) => ({ name: String(index), count }))
      )
      expect(result.reduce((sum, item) => sum + item.pct, 0)).toBe(100)
    }
  })
})

describe('first analytics visit after runs were already recorded', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('does not import a run again when history and analytics share one id', () => {
    const history = renderHook(() => useHistory())
    const runId = 'code-reviewer_1793008752066'

    act(() => {
      history.result.current.saveRun({
        runId,
        agentId: 'code-reviewer',
        agentName: 'Code Reviewer',
        inputs: {},
        output: 'ok',
        provider: 'openai',
      })
      recordAnalyticsRun({
        runId,
        agentId: 'code-reviewer',
        agentName: 'Code Reviewer',
        category: 'Engineering',
        provider: 'openai',
        model: 'gpt-4o',
        duration: 1200,
      })
    })

    expect(JSON.parse(localStorage.getItem('OpenAgents_history'))[0].id).toBe(runId)
    expect(JSON.parse(localStorage.getItem('OpenAgents_history'))[0].runId).toBeUndefined()

    const { result } = renderHook(() => useAnalytics())
    expect(result.current.stats.totalRuns).toBe(1)
    expect(result.current.events[0].category).toBe('Engineering')
  })

  it('still seeds history entries that were never recorded and keeps newest first', () => {
    localStorage.setItem('oa_analytics', JSON.stringify([
      { id: 'a_200', agentId: 'a', agentName: 'A', provider: 'x', category: 'Engineering', model: 'm', duration: 1, timestamp: 200 },
    ]))
    localStorage.setItem('OpenAgents_history', JSON.stringify([
      { id: 'a_200', agentId: 'a', agentName: 'A', provider: 'x', timestamp: 200 },
      { id: 'a_100', agentId: 'a', agentName: 'A', provider: 'x', timestamp: 100 },
    ]))

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events.map((e) => e.id)).toEqual(['a_200', 'a_100'])
    expect(result.current.stats.totalRuns).toBe(2)
  })

  it('falls back to the old id format when no runId is passed', () => {
    recordAnalyticsRun({ agentId: 'a', agentName: 'A' })
    const [event] = JSON.parse(localStorage.getItem('oa_analytics'))
    expect(event.id).toMatch(/^a_\d+$/)
  })
})
