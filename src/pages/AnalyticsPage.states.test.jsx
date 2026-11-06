import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  stats: null,
  byRange: {},
  spendRuns: [],
  totalSpend: 0,
  clearAnalytics: vi.fn(),
}))

vi.mock('../lib/useAnalytics', () => ({
  useAnalytics: (range) => ({
    stats: state.byRange[range] ?? state.stats,
    clearAnalytics: state.clearAnalytics,
  }),
}))
vi.mock('../lib/useSessionSpend', () => ({
  useSessionSpend: () => ({ runs: state.spendRuns, totalSpend: state.totalSpend }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import AnalyticsPage from './AnalyticsPage'

const emptyStats = {
  totalRuns: 0, uniqueAgents: 0, favoriteProvider: null, currentStreak: 0,
  longestStreak: 0, avgRunsPerDay: 0, mostProductiveDay: null,
  topAgents: [], providerDistribution: [], categoryDistribution: [],
  dailyRuns: [], heatmapData: [], recentRuns: [],
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/analytics']}>
      <Routes>
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/agents" element={<div>Agent library</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  state.stats = emptyStats
  state.byRange = {}
  state.spendRuns = []
  state.totalSpend = 0
})

afterEach(() => vi.restoreAllMocks())

describe('AnalyticsPage empty and filtered states', () => {
  it('renders the first-run state and navigates to the agent library', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No analytics yet' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear Data' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Run an Agent/ }))
    expect(screen.getByText('Agent library')).toBeInTheDocument()
  })

  it('keeps session usage visible when analytics has been cleared', () => {
    state.spendRuns = [
      { model: 'gpt-4o', inputTokens: 1000, outputTokens: 500, totalCost: 0.004, timestamp: 1 },
    ]
    state.totalSpend = 0.004
    renderPage()
    expect(screen.getByText('Token Usage & Cost (This Session)')).toBeInTheDocument()
    expect(screen.getByText('1,500')).toBeInTheDocument()
    expect(screen.getByText('Estimated cost (session)').previousElementSibling).toHaveTextContent('$0.0040')
    expect(screen.getByText('1,000 in · 500 out')).toBeInTheDocument()
  })

  it('recovers from a range with no data and can clear saved analytics', () => {
    state.stats = { ...emptyStats, totalRuns: 4, uniqueAgents: 1 }
    state.byRange = { '7d': emptyStats }
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Last 7 Days' }))
    expect(screen.getByRole('heading', { name: 'No data in this range' })).toBeInTheDocument()
    expect(screen.getByText(/Try selecting a broader range/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear Data' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Show All Time/ }))
    expect(screen.getByText('Total Runs')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear Data' }))
    expect(state.clearAnalytics).toHaveBeenCalledTimes(1)
  })
})
