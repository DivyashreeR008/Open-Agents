import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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
  notificationEmail: '',
  missedPolicy: 'skip',
  inputs: { topic: 'AI', tags: ['news', 'brief'] },
  systemPrompt: 'Be concise.',
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/automations/a1']}>
      <Routes>
        <Route path="/automations/:id" element={<AutomationDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getAutomation.mockReturnValue(automation)
  mocks.getRunsForAutomation.mockReturnValue([
    { id: 'r1', status: 'success', startedAt: 1700000000000, duration: 1200, tokens: 44 },
    { id: 'r2', status: 'missed', startedAt: 1700000100000, scheduledFor: 1700000100000 },
  ])
  mocks.getEmailLogs.mockReturnValue([
    {
      id: 'e1',
      subject: 'Digest sent',
      to: 'ops@example.com',
      sentAt: 1700000000000,
      status: 'delivered',
    },
  ])
})

describe('AutomationDetailPage tabs', () => {
  it('renders the history summary and opens missed-run details', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    expect(document.getElementById('history-summary').textContent).toContain('1 ran')
    expect(document.getElementById('history-summary').textContent).toContain('1 missed')
    fireEvent.click(screen.getByRole('button', { name: 'Details' }))
    expect(screen.getByText('Run drawer: r2')).toBeInTheDocument()
  })

  it('opens a successful run and deletes a run without selecting it', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByRole('button', { name: 'Inspect Output' }))
    expect(screen.getByText('Run drawer: r1')).toBeInTheDocument()

    fireEvent.click(screen.getAllByTitle('Delete Run')[0])
    expect(mocks.deleteRun).toHaveBeenCalledWith('r1')
  })

  it('renders the configuration snapshot and missed-run policy', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByRole('tab', { name: /Agent Configuration/ }))
    expect(screen.getByText('topic')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('tags')).toBeInTheDocument()
    expect(screen.getByText('news, brief')).toBeInTheDocument()
    expect(document.getElementById('missed-policy').textContent.length).toBeGreaterThan(10)
    expect(screen.getByText('Be concise.')).toBeInTheDocument()
  })

  it('renders email logs and disables test email without a recipient', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByRole('tab', { name: /Email & Delivery Logs/ }))
    expect(screen.getByText('Digest sent')).toBeInTheDocument()
    expect(screen.getByText(/ops@example.com/)).toBeInTheDocument()
    expect(screen.getByText('delivered')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Test Email' })).toBeDisabled()
  })
})
