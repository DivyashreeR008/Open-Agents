import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom'

const state = vi.hoisted(() => ({ stats: null }))

vi.mock('../lib/useAnalytics', () => ({
  useAnalytics: () => ({ stats: state.stats, clearAnalytics: vi.fn() }),
}))
vi.mock('../lib/useSessionSpend', () => ({
  useSessionSpend: () => ({ runs: [], totalSpend: 0 }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import AnalyticsPage from './AnalyticsPage'

const onlineStats = {
  totalRuns: 12,
  uniqueAgents: 3,
  favoriteProvider: 'openai',
  currentStreak: 4,
  longestStreak: 9,
  avgRunsPerDay: 1.7,
  mostProductiveDay: 'Tuesday',
  topAgents: [
    { agentId: 'a1', agentName: 'Researcher', count: 8 },
    { agentId: 'a2', agentName: 'Writer', count: 4 },
  ],
  providerDistribution: [
    { name: 'openai', count: 8, pct: 67 },
    { name: 'mystery', count: 4, pct: 33 },
  ],
  categoryDistribution: [
    { name: 'Research', count: 7, pct: 58 },
    { name: 'Writing', count: 5, pct: 42 },
  ],
  dailyRuns: Array.from({ length: 30 }, (_, i) => ({ date: `2026-10-${i + 1}`, count: i % 4 })),
  heatmapData: Array.from({ length: 14 }, (_, i) => ({
    date: `2026-11-${String(i + 1).padStart(2, '0')}`,
    count: i % 5,
  })),
  recentRuns: [
    {
      id: 'a9_run',
      agentName: 'Chronologist',
      category: 'Research',
      provider: 'anthropic',
      model: 'claude-3-5',
      duration: 2500,
      timestamp: Date.UTC(2026, 10, 3, 12),
    },
  ],
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

function AgentMarker() {
  const { id } = useParams()
  return <div>Agent page {id}</div>
}

beforeEach(() => {
  state.stats = onlineStats
})

describe('AnalyticsPage populated metrics', () => {
  it('renders the primary and secondary metric cards', () => {
    renderPage()
    expect(screen.getByText('Total Runs').previousElementSibling).toHaveTextContent('12')
    expect(screen.getByText('Unique Agents').previousElementSibling).toHaveTextContent('3')
    expect(screen.getByText('Fav Provider').previousElementSibling).toHaveTextContent('OpenAI')
    expect(screen.getByText('Day Streak').previousElementSibling).toHaveTextContent('4')
    expect(screen.getByText('Best Streak').previousElementSibling).toHaveTextContent('9 days')
    expect(screen.getByText('Avg/Day').previousElementSibling).toHaveTextContent('1.7')
    expect(screen.getByText('Peak Day').previousElementSibling).toHaveTextContent('Tuesday')
    expect(screen.getAllByText('Categories')[0].previousElementSibling).toHaveTextContent('2')
  })

  it('renders chart labels, heatmap announcements, and agent navigation', () => {
    renderPage()
    const days = screen.getAllByRole('img')
    expect(days).toHaveLength(14)
    fireEvent.click(days[3])
    expect(screen.getByText('2026-11-04: 3 runs')).toBeInTheDocument()

    expect(screen.getByText('Researcher')).toBeInTheDocument()
    expect(screen.getByText('OpenAI (67%)')).toBeInTheDocument()
    expect(screen.getByText('Unknown (33%)')).toBeInTheDocument()
    expect(screen.getByText('RUNS')).toBeInTheDocument()
    expect(screen.getAllByText('Research')[0]).toBeInTheDocument()
    expect(screen.getByText('7 (58%)')).toBeInTheDocument()
    expect(screen.getByText('30 days ago')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Researcher'))
    expect(screen.getByText('Agent page a1')).toBeInTheDocument()
  })

  it('renders recent activity and navigates from the agent id prefix', () => {
    renderPage()
    expect(screen.getByText('Chronologist')).toBeInTheDocument()
    expect(screen.getByText('claude-3-5')).toBeInTheDocument()
    expect(screen.getByText('2.5s')).toBeInTheDocument()
    expect(screen.getByText('Anthropic')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Chronologist'))
    expect(screen.getByText('Agent page a9')).toBeInTheDocument()
  })
})
