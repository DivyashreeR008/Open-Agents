import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
    name: 'Daily digest',
    enabled: true,
    schedule: 'daily',
    agentName: 'Summarizer',
    missedPolicy: 'skip',
    inputs: {},
  })
  mocks.getRunsForAutomation.mockReturnValue([])
  mocks.getEmailLogs.mockReturnValue([])
})

describe('AutomationDetailPage tab semantics', () => {
  it('exposes a labelled tab set and one selected panel at a time', async () => {
    render(
      <MemoryRouter initialEntries={['/automations/a1']}>
        <Routes>
          <Route path="/automations/:id" element={<AutomationDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    await screen.findByRole('tablist', { name: 'Automation details sections' })
    const history = screen.getByRole('tab', { name: /Execution History/ })
    const config = screen.getByRole('tab', { name: 'Agent Configuration' })

    expect(history).toHaveAttribute('aria-selected', 'true')
    expect(history).toHaveAttribute('aria-controls', 'automation-panel-history')
    expect(screen.getByRole('tabpanel', { name: /Execution History/ })).toBeInTheDocument()

    config.focus()
    fireEvent.keyDown(config, { key: 'ArrowRight' })
    const emails = screen.getByRole('tab', { name: 'Email & Delivery Logs' })
    expect(emails).toHaveAttribute('aria-selected', 'true')
    await waitFor(() => expect(emails).toHaveFocus())
    expect(screen.getByRole('tabpanel', { name: 'Email & Delivery Logs' })).toBeInTheDocument()
    expect(screen.queryByRole('tabpanel', { name: /Execution History/ })).not.toBeInTheDocument()
  })

  it('wraps with arrow keys and supports Home and End', async () => {
    render(
      <MemoryRouter initialEntries={['/automations/a1']}>
        <Routes>
          <Route path="/automations/:id" element={<AutomationDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    const history = await screen.findByRole('tab', { name: /Execution History/ })
    const emails = screen.getByRole('tab', { name: 'Email & Delivery Logs' })

    history.focus()
    fireEvent.keyDown(history, { key: 'ArrowLeft' })
    expect(emails).toHaveAttribute('aria-selected', 'true')
    await waitFor(() => expect(emails).toHaveFocus())

    fireEvent.keyDown(emails, { key: 'Home' })
    expect(history).toHaveAttribute('aria-selected', 'true')
    await waitFor(() => expect(history).toHaveFocus())
    fireEvent.keyDown(history, { key: 'End' })
    expect(emails).toHaveAttribute('aria-selected', 'true')
  })
})
