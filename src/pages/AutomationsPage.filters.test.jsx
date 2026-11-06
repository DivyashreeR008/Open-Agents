import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const svc = vi.hoisted(() => ({
  automations: [],
  runs: [],
  loadAutomations: vi.fn(),
  loadRuns: vi.fn(),
  toggleAutomation: vi.fn(),
  deleteAutomation: vi.fn(),
  runAutomationNow: vi.fn(),
  initAutomationEngine: vi.fn(),
}))

vi.mock('../lib/automationsService', () => ({
  loadAutomations: svc.loadAutomations,
  loadRuns: svc.loadRuns,
  toggleAutomation: svc.toggleAutomation,
  deleteAutomation: svc.deleteAutomation,
  runAutomationNow: svc.runAutomationNow,
  initAutomationEngine: svc.initAutomationEngine,
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/CreateAutomationModal', () => ({ default: () => null }))

import AutomationsPage from './AutomationsPage'

const now = Date.now()
const automations = [
  {
    id: 'a1',
    name: 'Daily Digest',
    agentName: 'Summarizer',
    category: 'Research',
    enabled: true,
    schedule: 'daily',
    cron: '0 9 * * *',
    provider: 'openai',
    model: 'gpt-4o',
    emailNotification: true,
    lastRunAt: now - 60000,
    nextRunAt: now + 3 * 86400000 + 2 * 3600000,
  },
  {
    id: 'a2',
    name: 'Weekly Review',
    agentName: 'Editor',
    category: 'Writing',
    enabled: false,
    schedule: 'weekly',
    cron: '0 10 * * 1',
    provider: 'anthropic',
    model: 'claude',
    emailNotification: false,
    lastRunAt: null,
    nextRunAt: null,
  },
  {
    id: 'a3',
    name: 'Hourly Monitor',
    agentName: 'Ops Bot',
    category: 'Operations',
    enabled: true,
    schedule: 'hourly',
    cron: '0 * * * *',
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    emailNotification: false,
    lastRunAt: null,
    nextRunAt: now + 1800000,
  },
]
const runs = [
  { id: 'r1', automationId: 'a1', status: 'success' },
  { id: 'r2', automationId: 'a1', status: 'error' },
  { id: 'r3', automationId: 'a2', status: 'success' },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <AutomationsPage />
    </MemoryRouter>
  )
}
const card = (name) => screen.queryByRole('heading', { name })

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  svc.automations = automations
  svc.runs = runs
  svc.loadAutomations.mockImplementation(() => svc.automations)
  svc.loadRuns.mockImplementation(() => svc.runs)
})

describe('AutomationsPage search and filters', () => {
  it('searches names, agents, and categories', () => {
    renderPage()
    const search = screen.getByLabelText('Search automations or agents')
    fireEvent.change(search, { target: { value: 'summarizer' } })
    expect(card('Daily Digest')).toBeInTheDocument()
    expect(card('Weekly Review')).not.toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'writing' } })
    expect(card('Weekly Review')).toBeInTheDocument()
    expect(card('Hourly Monitor')).not.toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'daily digest' } })
    expect(card('Daily Digest')).toBeInTheDocument()
    expect(card('Weekly Review')).not.toBeInTheDocument()
  })

  it('filters by status and schedule without changing the summary counts', () => {
    renderPage()
    const status = screen.getByLabelText('Filter by status')
    const schedule = screen.getByLabelText('Filter by schedule')

    fireEvent.change(status, { target: { value: 'active' } })
    expect(card('Daily Digest')).toBeInTheDocument()
    expect(card('Hourly Monitor')).toBeInTheDocument()
    expect(card('Weekly Review')).not.toBeInTheDocument()
    fireEvent.change(status, { target: { value: 'paused' } })
    expect(card('Weekly Review')).toBeInTheDocument()
    expect(card('Daily Digest')).not.toBeInTheDocument()

    fireEvent.change(status, { target: { value: 'all' } })
    fireEvent.change(schedule, { target: { value: 'weekly' } })
    expect(card('Weekly Review')).toBeInTheDocument()
    expect(card('Daily Digest')).not.toBeInTheDocument()
    fireEvent.change(schedule, { target: { value: 'hourly' } })
    expect(card('Hourly Monitor')).toBeInTheDocument()
    expect(card('Weekly Review')).not.toBeInTheDocument()

    expect(
      screen.getByText('Total Automations').parentElement.nextElementSibling
    ).toHaveTextContent('3')
    expect(
      screen.getByText('Active Autopilots').parentElement.nextElementSibling
    ).toHaveTextContent('2')
  })

  it('combines filters and explains a no-match state', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Search automations or agents'), {
      target: { value: 'ops' },
    })
    fireEvent.change(screen.getByLabelText('Filter by status'), { target: { value: 'active' } })
    fireEvent.change(screen.getByLabelText('Filter by schedule'), { target: { value: 'hourly' } })
    expect(card('Hourly Monitor')).toBeInTheDocument()
    expect(card('Daily Digest')).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search automations or agents'), {
      target: { value: 'missing' },
    })
    expect(screen.getByRole('heading', { name: 'No automations found' })).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting your search query or filters/)).toBeInTheDocument()
  })

  it('refreshes stored automations and runs', () => {
    renderPage()
    expect(svc.loadAutomations).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByTitle('Refresh list'))
    expect(svc.loadAutomations).toHaveBeenCalledTimes(2)
    expect(svc.loadRuns).toHaveBeenCalledTimes(2)
  })
})
