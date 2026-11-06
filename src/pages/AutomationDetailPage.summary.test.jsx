import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  getAutomation: vi.fn(),
  getRunsForAutomation: vi.fn(),
  toggleAutomation: vi.fn(),
  deleteAutomation: vi.fn(),
  runAutomationNow: vi.fn(),
  sendResendNotification: vi.fn(),
  deleteRun: vi.fn(),
  getEmailLogs: vi.fn(),
}))

vi.mock('../lib/automationsService', () => mocks)
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/AutomationRunDrawer', () => ({
  default: ({ run, isOpen }) => (isOpen ? <div>Run drawer: {run?.id}</div> : null),
}))
vi.mock('../components/CreateAutomationModal', () => ({
  default: ({ isOpen }) => (isOpen ? <div>Edit modal</div> : null),
}))

import AutomationDetailPage from './AutomationDetailPage'

const automation = {
  id: 'a1',
  name: 'Daily digest',
  enabled: true,
  schedule: 'Every day',
  cron: '0 9 * * *',
  agentId: 'summarizer',
  agentName: 'Summarizer',
  provider: 'openai',
  model: 'gpt-4.1-mini',
  createdAt: 1700000000000,
  notificationEmail: 'ops@example.com',
  missedPolicy: 'skip',
  inputs: { topic: 'AI' },
}

function renderPage(id = 'a1') {
  return render(
    <MemoryRouter initialEntries={[`/automations/${id}`]}>
      <Routes>
        <Route path="/automations/:id" element={<AutomationDetailPage />} />
        <Route path="/automations" element={<div>Automation list</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getAutomation.mockReturnValue(automation)
  mocks.getRunsForAutomation.mockReturnValue([
    { id: 'r1', status: 'success', startedAt: 1700000000000, duration: 1000, tokens: 100 },
    { id: 'r2', status: 'failed', startedAt: 1700000100000, duration: 3000, tokens: 300 },
  ])
  mocks.getEmailLogs.mockReturnValue([])
})

describe('AutomationDetailPage summary', () => {
  it('renders the missing automation branch and return link', () => {
    mocks.getAutomation.mockReturnValue(null)
    renderPage('gone')
    expect(screen.getByRole('heading', { name: 'Automation Not Found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return to Automations' })).toHaveAttribute(
      'href',
      '/automations'
    )
  })

  it('renders enabled metadata and computed summary values', async () => {
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Daily digest' })).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText(/Every day/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Summarizer' })).toHaveAttribute(
      'href',
      '/agent/summarizer'
    )
    expect(screen.getByText(/openai/)).toBeInTheDocument()
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('2.00s')).toBeInTheDocument()
    expect(screen.getByText('Encrypted')).toBeInTheDocument()
  })

  it('renders the paused status', async () => {
    mocks.getAutomation.mockReturnValue({ ...automation, enabled: false })
    renderPage()
    expect(await screen.findByText('Paused')).toBeInTheDocument()
  })

  it('keeps the success rate at 100 with no executed runs', async () => {
    mocks.getRunsForAutomation.mockReturnValue([])
    renderPage()
    expect(await screen.findByText('100%')).toBeInTheDocument()
    expect(screen.getByText('0.00s')).toBeInTheDocument()
  })
})
