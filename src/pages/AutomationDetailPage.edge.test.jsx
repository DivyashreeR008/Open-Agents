import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
    name: 'Quiet digest',
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
    systemPrompt: '',
  })
  mocks.getRunsForAutomation.mockReturnValue([])
  mocks.getEmailLogs.mockReturnValue([])
})

describe('AutomationDetailPage empty history', () => {
  it('shows the zero-run and zero-email empty states', async () => {
    render(
      <MemoryRouter initialEntries={['/automations/a1']}>
        <Routes>
          <Route path="/automations/:id" element={<AutomationDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByRole('heading', { name: 'Quiet digest' })).toBeInTheDocument()
    expect(screen.getByText('Execution History (0)')).toBeInTheDocument()
    expect(screen.getByText('No recorded runs yet')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Email & Delivery Logs'))
    expect(screen.getByText('No email delivery logs recorded yet.')).toBeInTheDocument()
  })
})
