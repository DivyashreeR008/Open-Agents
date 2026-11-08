import { beforeEach, describe, expect, it, vi } from 'vitest'
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
vi.mock('../components/AutomationRunDrawer', () => ({ default: () => null }))
vi.mock('../components/CreateAutomationModal', () => ({ default: () => null }))

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
  inputs: {},
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
    {
      id: 'r1',
      status: 'success',
      startedAt: 1700000000000,
      scheduledFor: 1699999000000,
      duration: 1200,
      tokens: 40,
      catchUp: true,
      emailSent: false,
    },
  ])
  mocks.getEmailLogs.mockReturnValue([])
})

describe('AutomationDetailPage catch-up runs', () => {
  it('marks the run as catch-up and shows when it was due', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Daily digest' })).toBeInTheDocument()
    expect(screen.getByText('catch-up')).toBeInTheDocument()
    expect(screen.getByText(/was due/)).toBeInTheDocument()
  })
})
