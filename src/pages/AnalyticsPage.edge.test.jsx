import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'

const state = vi.hoisted(() => ({
  stats: null,
  byRange: {},
  spendRuns: [],
  totalSpend: 0,
}))

vi.mock('../lib/useAnalytics', () => ({
  useAnalytics: (range) => ({
    stats: state.byRange[range] ?? state.stats,
    clearAnalytics: vi.fn(),
  }),
}))
vi.mock('../lib/useSessionSpend', () => ({
  useSessionSpend: () => ({ runs: state.spendRuns, totalSpend: state.totalSpend }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import AnalyticsPage from './AnalyticsPage'

const baseStats = {
  totalRuns: 6,
  uniqueAgents: 2,
  favoriteProvider: 'custom',
  currentStreak: 1,
  longestStreak: 3,
  avgRunsPerDay: 0.4,
  mostProductiveDay: null,
  topAgents: [],
  providerDistribution: [],
  categoryDistribution: [],
  dailyRuns: [],
  heatmapData: [],
  recentRuns: [],
}

function AgentMarker() {
  const { id } = useParams()
  return <div>Agent page {id}</div>
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/analytics']}>
      <Routes>
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/agent/:id" element={<AgentMarker />} />
      </Routes>
    </MemoryRouter>
  )
}

function formatStamp(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  state.stats = { ...baseStats }
  state.byRange = {}
  state.spendRuns = []
  state.totalSpend = 0
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('AnalyticsPage sparse chart data', () => {
  it('renders placeholders when every chart collection is empty', () => {
    renderPage()

    expect(screen.getByText('No agent data yet')).toBeInTheDocument()
    expect(screen.getByText('No provider data')).toBeInTheDocument()
    expect(screen.getByText('No category data')).toBeInTheDocument()
    expect(screen.getByText('Not enough data')).toBeInTheDocument()
    expect(screen.getByText('No recent activity')).toBeInTheDocument()
  })

  it('pads a partial heatmap week and announces singular and high-count days', () => {
    const heatmapData = Array.from({ length: 9 }, (_, i) => ({
      date: `2025-12-${String(25 + i).padStart(2, '0')}`,
      count: i === 4 ? 6 : i === 1 ? 1 : 0,
    }))
    state.stats = {
      ...baseStats,
      totalRuns: 7,
      heatmapData,
      dailyRuns: [
        { date: '2025-12-31', count: 1 },
        { date: '2026-01-01', count: 2 },
      ],
    }

    renderPage()

    const days = screen.getAllByRole('img')
    expect(days).toHaveLength(9)
    fireEvent.click(days[4])
    expect(screen.getByText('2025-12-29: 6 runs')).toBeInTheDocument()
    fireEvent.click(days[1])
    expect(screen.getByText('2025-12-26: 1 run')).toBeInTheDocument()
  })
})

describe('AnalyticsPage malformed activity records', () => {
  it('renders an incomplete run without navigating and without inventing fields', () => {
    const timestamp = Date.UTC(2025, 11, 31, 23, 59)
    state.stats = {
      ...baseStats,
      recentRuns: [{ timestamp, provider: 'mystery', duration: 0 }],
    }

    renderPage()

    expect(screen.getByText('Unknown Agent')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByText(formatStamp(timestamp))).toBeInTheDocument()
    expect(screen.queryByText('0.0s')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Unknown Agent'))
    expect(screen.queryByText(/^Agent page/)).not.toBeInTheDocument()
  })

  it('keeps session usage visible when a selected range has no records', () => {
    state.stats = { ...baseStats, totalRuns: 4 }
    state.byRange = { '7d': { ...baseStats, totalRuns: 0 } }
    state.spendRuns = [
      {
        model: 'gpt-4o-mini',
        inputTokens: 10,
        outputTokens: 5,
        totalCost: 0.001,
        timestamp: 1,
      },
    ]
    state.totalSpend = 0.001

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Last 7 Days' }))

    expect(screen.getByRole('heading', { name: 'No data in this range' })).toBeInTheDocument()
    expect(screen.getByText('Token Usage & Cost (This Session)')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getAllByText('$0.001')).not.toHaveLength(0)
  })
})
