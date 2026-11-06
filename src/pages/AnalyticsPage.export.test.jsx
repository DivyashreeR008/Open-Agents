import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({
  stats: null,
  spendRuns: [],
  totalSpend: 0,
}))

vi.mock('../lib/useAnalytics', () => ({
  useAnalytics: () => ({ stats: state.stats, clearAnalytics: vi.fn() }),
}))
vi.mock('../lib/useSessionSpend', () => ({
  useSessionSpend: () => ({ runs: state.spendRuns, totalSpend: state.totalSpend }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import AnalyticsPage from './AnalyticsPage'

const stats = {
  totalRuns: 5, uniqueAgents: 2, favoriteProvider: 'openai', currentStreak: 2,
  longestStreak: 4, avgRunsPerDay: 0.7, mostProductiveDay: 'Monday',
  topAgents: [{ agentId: 'a1', agentName: 'Researcher', count: 3 }],
  providerDistribution: [{ name: 'openai', count: 5, pct: 100 }],
  categoryDistribution: [{ name: 'Research', count: 5, pct: 100 }],
  dailyRuns: [{ date: '2026-11-01', count: 2 }, { date: '2026-11-02', count: 3 }],
  heatmapData: [{ date: '2026-11-01', count: 2 }],
  recentRuns: [],
}

function renderPage() {
  return render(<MemoryRouter><AnalyticsPage /></MemoryRouter>)
}

const originalCreate = URL.createObjectURL
const originalRevoke = URL.revokeObjectURL

beforeEach(() => {
  vi.clearAllMocks()
  state.stats = stats
  state.spendRuns = [
    { model: 'gpt-4o', inputTokens: 1000, outputTokens: 500, totalCost: 0.005, timestamp: 2 },
    { model: 'claude-3-5', inputTokens: 200, outputTokens: 100, totalCost: 0.003, timestamp: 1 },
  ]
  state.totalSpend = 0.008
})

afterEach(() => {
  if (originalCreate) URL.createObjectURL = originalCreate
  else delete URL.createObjectURL
  if (originalRevoke) URL.revokeObjectURL = originalRevoke
  else delete URL.revokeObjectURL
  vi.restoreAllMocks()
})

describe('AnalyticsPage session spend and export', () => {
  it('sums session tokens and formats sub-cent costs', () => {
    renderPage()
    expect(screen.getByText('Token Usage & Cost (This Session)')).toBeInTheDocument()
    expect(screen.getByText('1,800')).toBeInTheDocument()
    expect(screen.getByText('$0.0080')).toBeInTheDocument()
    expect(screen.getByText('1,000 in · 500 out')).toBeInTheDocument()
    expect(screen.getByText('200 in · 100 out')).toBeInTheDocument()
    expect(screen.getByText('$0.0050')).toBeInTheDocument()
    expect(screen.getByText('$0.0030')).toBeInTheDocument()
  })

  it('downloads the dashboard payload and revokes the object URL', async () => {
    const createObjectURL = vi.fn(() => 'blob:dashboard')
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = createObjectURL
    URL.revokeObjectURL = revokeObjectURL
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Export Dashboard Data/ }))

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    const blob = createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('application/json')
    const payload = JSON.parse(await blob.text())
    expect(payload.summary.totalRuns).toBe(5)
    expect(payload.topAgents[0].agentName).toBe('Researcher')
    expect(payload.providerDistribution[0].name).toBe('openai')
    expect(payload.dailyRuns).toHaveLength(2)
    expect(click).toHaveBeenCalledTimes(1)
    expect(click.mock.instances[0].download).toMatch(/^dashboard-export-/)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:dashboard')
  })

  it('hides the session panel when there are no session runs', () => {
    state.spendRuns = []
    state.totalSpend = 0
    renderPage()
    expect(screen.queryByText('Token Usage & Cost (This Session)')).not.toBeInTheDocument()
  })
})
