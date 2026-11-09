import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAnalytics } from './useAnalytics'

const ANALYTICS_KEY = 'oa_analytics'
const SEED_FLAG = 'oa_analytics_seeded'

describe('analytics seeding duplicate protection', () => {
  beforeEach(() => localStorage.clear())

  it('does not seed a history run whose id is already stored', () => {
    const existing = {
      id: 'shared-run',
      agentId: 'agent-1',
      agentName: 'Agent One',
      provider: 'openai',
      category: 'Engineering',
      model: 'gpt-4o',
      duration: 12,
      timestamp: 500,
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify([existing]))
    localStorage.setItem('OpenAgents_history', JSON.stringify([{ ...existing, timestamp: 400 }]))

    const { result } = renderHook(() => useAnalytics())

    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0].id).toBe('shared-run')
    expect(JSON.parse(localStorage.getItem(ANALYTICS_KEY))).toHaveLength(1)
    expect(localStorage.getItem(SEED_FLAG)).toBe('1')
  })
})
