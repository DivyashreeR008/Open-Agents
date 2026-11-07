import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({ stats: null }))

vi.mock('../lib/useAnalytics', () => ({
  useAnalytics: () => ({ stats: state.stats, clearAnalytics: vi.fn() }),
}))
vi.mock('../lib/useSessionSpend', () => ({
  useSessionSpend: () => ({ runs: [], totalSpend: 0 }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import AnalyticsPage from './AnalyticsPage'

const stats = {
  totalRuns: 3,
  uniqueAgents: 1,
  favoriteProvider: 'openai',
  currentStreak: 1,
  longestStreak: 2,
  avgRunsPerDay: 1,
  mostProductiveDay: 'Monday',
  topAgents: [],
  providerDistribution: [],
  categoryDistribution: [],
  dailyRuns: [],
  heatmapData: [
    { date: '2026-11-01', count: 0 },
    { date: '2026-11-02', count: 2 },
  ],
  recentRuns: [],
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/analytics']}>
      <Routes>
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  state.stats = stats
})

describe('AnalyticsPage heatmap focus announcement', () => {
  it('announces a day when it receives keyboard focus without a click', () => {
    renderPage()

    const days = screen.getAllByRole('img')
    fireEvent.focus(days[1])

    expect(screen.getByText('2026-11-02: 2 runs')).toBeInTheDocument()
  })
})
