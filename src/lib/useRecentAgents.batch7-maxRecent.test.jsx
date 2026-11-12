import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRecentAgents } from './useRecentAgents'

beforeEach(() => localStorage.clear())

describe('useRecentAgents limits', () => {
  it('keeps the eight newest distinct agents and skips runs without an id', () => {
    const runs = [
      { agentId: null, agentName: 'Missing' },
      ...Array.from({ length: 10 }, (_, index) => ({
        agentId: 'a' + index,
        agentName: 'Agent ' + index,
        timestamp: index,
      })),
    ]
    localStorage.setItem('OpenAgents_history', JSON.stringify(runs))

    const { result } = renderHook(() => useRecentAgents())

    expect(result.current.recentAgents).toHaveLength(8)
    expect(result.current.recentAgents.map((agent) => agent.id)).toEqual([
      'a0',
      'a1',
      'a2',
      'a3',
      'a4',
      'a5',
      'a6',
      'a7',
    ])
  })
})
