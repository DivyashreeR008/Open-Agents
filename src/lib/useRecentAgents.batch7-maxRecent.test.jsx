import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecentAgents } from './useRecentAgents'

const HISTORY_KEY = 'OpenAgents_history'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useRecentAgents max recent', () => {
  it('keeps the eight newest distinct agents and skips runs without an id', () => {
    // 10 distinct agents, plus duplicate runs and runs without an agentId
    const history = [
      { agentId: 'agent-1', agentName: 'Agent 1', timestamp: 1000 },
      { agentName: 'Missing ID Agent', timestamp: 950 },
      null,
      { agentId: 'agent-2', agentName: 'Agent 2', timestamp: 900 },
      { agentId: 'agent-1', agentName: 'Agent 1 Duplicate', timestamp: 850 },
      { agentId: 'agent-3', agentName: 'Agent 3', timestamp: 800 },
      { agentId: '', agentName: 'Empty String ID', timestamp: 750 },
      { agentId: 'agent-4', agentName: 'Agent 4', timestamp: 700 },
      { agentId: 'agent-5', agentName: 'Agent 5', timestamp: 600 },
      { agentId: 'agent-6', agentName: 'Agent 6', timestamp: 500 },
      { agentId: 'agent-7', agentName: 'Agent 7', timestamp: 400 },
      { agentId: 'agent-8', agentName: 'Agent 8', timestamp: 300 },
      { agentId: 'agent-9', agentName: 'Agent 9', timestamp: 200 },
      { agentId: 'agent-10', agentName: 'Agent 10', timestamp: 100 },
    ]

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))

    const { result } = renderHook(() => useRecentAgents())

    expect(result.current.recentAgents).toHaveLength(8)
    expect(result.current.recentAgents.map((a) => a.id)).toEqual([
      'agent-1',
      'agent-2',
      'agent-3',
      'agent-4',
      'agent-5',
      'agent-6',
      'agent-7',
      'agent-8',
    ])
  })

  it('handles empty history gracefully', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]))

    const { result } = renderHook(() => useRecentAgents())

    expect(result.current.recentAgents).toEqual([])
  })
})
