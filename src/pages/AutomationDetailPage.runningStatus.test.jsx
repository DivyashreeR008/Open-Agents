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

beforeEach(() => {
  vi.clearAllMocks()
  mocks.getAutomation.mockReturnValue({
    id: 'a1',
    name: 'Running digest',
    enabled: true,
    schedule: 'Every day',
    cron: '0 9 * * *',
    agentId: 'a1',
    agentName: 'Summarizer',
    provider: 'openai',
    model: 'gpt-4o',
    createdAt: 1700000000000,
    notificationEmail: '',
    missedPolicy: 'skip',
    inputs: {},
  })
  mocks.getRunsForAutomation.mockReturnValue([
    {
      id: 'running-run',
      status: 'running',
      startedAt: Date.now(),
      duration: 1000,
      tokens: 12,
      emailSent: false,
    },
  ])
  mocks.getEmailLogs.mockReturnValue([])
})

describe('AutomationDetailPage running history row', () => {
  it('shows a spinner for a run that is still marked running', async () => {
    render(
      <MemoryRouter initialEntries={['/automations/a1']}>
        <Routes>
          <Route path="/automations/:id" element={<AutomationDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Running digest' })
    const row = screen.getByText('running').closest('tr')

    expect(row.querySelector('.animate-spin')).not.toBeNull()
  })
})
