import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
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
vi.mock('../components/AutomationRunDrawer', () => ({
  default: ({ run, isOpen }) => (isOpen ? <div>Run drawer: {run?.id}</div> : null),
}))
vi.mock('../components/CreateAutomationModal', () => ({
  default: ({ isOpen }) => (isOpen ? <div>Edit modal</div> : null),
}))

import AutomationDetailPage from './AutomationDetailPage'

const automation = {
  id: 'a1', name: 'Daily digest', enabled: true, schedule: 'Every day', cron: '0 9 * * *',
  agentId: 'summarizer', agentName: 'Summarizer', provider: 'openai', model: 'gpt-4.1-mini',
  createdAt: 1700000000000, notificationEmail: 'ops@example.com', missedPolicy: 'skip', inputs: {},
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/automations/a1']}>
      <Routes>
        <Route path="/automations" element={<div>Automation list</div>} />
        <Route path="/automations/:id" element={<AutomationDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('confirm', vi.fn(() => true))
  vi.stubGlobal('alert', vi.fn())
  mocks.getAutomation.mockReturnValue(automation)
  mocks.getRunsForAutomation.mockReturnValue([])
  mocks.getEmailLogs.mockReturnValue([])
  mocks.toggleAutomation.mockResolvedValue(undefined)
  mocks.deleteAutomation.mockResolvedValue(undefined)
  mocks.sendResendNotification.mockResolvedValue(undefined)
})

afterEach(() => vi.unstubAllGlobals())

describe('AutomationDetailPage actions', () => {
  it('runs the automation and opens the finished run', async () => {
    mocks.runAutomationNow.mockResolvedValue({ id: 'r9', status: 'success' })
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getAllByRole('button', { name: 'Run Autopilot Now' })[0])
    await screen.findByText('Run drawer: r9')
    expect(mocks.runAutomationNow).toHaveBeenCalledWith('a1')
  })

  it('reports a rejected run and restores the control', async () => {
    mocks.runAutomationNow.mockRejectedValue(new Error('Offline'))
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getAllByRole('button', { name: 'Run Autopilot Now' })[0])
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Offline'))
    expect(screen.getAllByRole('button', { name: 'Run Autopilot Now' })[0]).toBeEnabled()
  })

  it('toggles and deletes through the toolbar', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByTitle('Pause Autopilot'))
    await waitFor(() => expect(mocks.toggleAutomation).toHaveBeenCalledWith('a1'))

    fireEvent.click(screen.getByTitle('Delete Automation'))
    await waitFor(() => expect(mocks.deleteAutomation).toHaveBeenCalledWith('a1'))
    expect(await screen.findByText('Automation list')).toBeInTheDocument()
  })

  it('does not delete when confirmation is cancelled', async () => {
    window.confirm.mockReturnValue(false)
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByTitle('Delete Automation'))
    expect(mocks.deleteAutomation).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: 'Daily digest' })).toBeInTheDocument()
  })

  it('sends a test email and reports success', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByRole('button', { name: /Email & Delivery Logs/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Send Test Email' }))
    await screen.findByText('Test email dispatched successfully via Resend!')
    expect(mocks.sendResendNotification).toHaveBeenCalledWith(expect.objectContaining({ to: 'ops@example.com' }))
  })

  it('reports a failed test email', async () => {
    mocks.sendResendNotification.mockRejectedValue(new Error('blocked'))
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByRole('button', { name: /Email & Delivery Logs/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Send Test Email' }))
    await screen.findByText('Failed to send test email.')
  })
})
