import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({ stats: null, spendRuns: [], totalSpend: 0 }))

vi.mock('../lib/useAnalytics', () => ({
  useAnalytics: () => ({ stats: state.stats, clearAnalytics: vi.fn() }),
}))
vi.mock('../lib/useSessionSpend', () => ({
  useSessionSpend: () => ({ runs: state.spendRuns, totalSpend: state.totalSpend }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import AnalyticsPage from './AnalyticsPage'

const stats = {
  totalRuns: 1,
  uniqueAgents: 1,
  favoriteProvider: null,
  currentStreak: 0,
  longestStreak: 0,
  avgRunsPerDay: 0,
  mostProductiveDay: null,
  topAgents: [],
  providerDistribution: [],
  categoryDistribution: [],
  dailyRuns: [],
  heatmapData: [],
  recentRuns: [],
}

beforeEach(() => {
  state.stats = stats
  state.spendRuns = [{ model: 'gpt-4o', outputTokens: 5, totalCost: 0.002, timestamp: 1 }]
  state.totalSpend = 0.002
})

describe('AnalyticsPage session input-token fallback', () => {
  it('counts a missing input token value as zero while keeping output tokens', () => {
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('0 in · 5 out')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
