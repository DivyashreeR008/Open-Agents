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
  state.spendRuns = [{ totalCost: 0.001, timestamp: 1 }]
  state.totalSpend = 0.001
})

describe('AnalyticsPage session token fallbacks', () => {
  it('shows an unknown model and zero token counts for a sparse session run', () => {
    render(
      <MemoryRouter>
        <AnalyticsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Unknown model')).toBeInTheDocument()
    expect(screen.getByText('0 in · 0 out')).toBeInTheDocument()
  })
})
