import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({ stats: null }))

vi.mock('../lib/useAnalytics', () => ({
  useAnalytics: () => ({ stats: state.stats, clearAnalytics: vi.fn() }),
}))
vi.mock('../lib/useSessionSpend', () => ({
  useSessionSpend: () => ({ runs: [], totalSpend: 0 }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import AnalyticsPage from './AnalyticsPage'

const baseStats = {
  totalRuns: 1,
  uniqueAgents: 1,
  favoriteProvider: 'openai',
  currentStreak: 1,
  longestStreak: 1,
  avgRunsPerDay: 1,
  mostProductiveDay: 'Monday',
  topAgents: [],
  providerDistribution: [],
  categoryDistribution: [],
  dailyRuns: [],
  heatmapData: [],
}

beforeEach(() => {
  state.stats = {
    ...baseStats,
    recentRuns: [
      {
        id: 'sparse_run',
        duration: 1000,
        timestamp: Date.UTC(2026, 10, 3, 12),
      },
    ],
  }
})

describe('AnalyticsPage recent activity fallbacks', () => {
  it('labels a sparse recent run with the unknown agent and provider fallbacks', () => {
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Unknown Agent')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })
})
