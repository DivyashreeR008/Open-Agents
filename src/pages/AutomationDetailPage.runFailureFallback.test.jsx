import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  notificationEmail: 'ops@example.com',
  missedPolicy: 'skip',
  inputs: {},
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('alert', vi.fn())
  mocks.getAutomation.mockReturnValue(automation)
  mocks.getRunsForAutomation.mockReturnValue([])
  mocks.getEmailLogs.mockReturnValue([])
})

afterEach(() => vi.unstubAllGlobals())

describe('AutomationDetailPage run failure fallback', () => {
  it('uses a generic alert when the rejected run has no message', async () => {
    mocks.runAutomationNow.mockRejectedValue({})
    render(
      <MemoryRouter initialEntries={['/automations/a1']}>
        <Routes>
          <Route path="/automations/:id" element={<AutomationDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getAllByRole('button', { name: 'Run Autopilot Now' })[0])

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Execution failed'))
  })
})
