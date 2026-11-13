import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  default: ({ run, isOpen, onClose }) =>
    isOpen ? (
      <div>
        Run drawer: {run?.id}
        <button onClick={onClose}>Close run drawer</button>
      </div>
    ) : null,
}))
vi.mock('../components/CreateAutomationModal', () => ({
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <div>
        Edit modal
        <button onClick={onClose}>Close edit modal</button>
      </div>
    ) : null,
}))

import AutomationDetailPage from './AutomationDetailPage'

const baseAutomation = {
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
  vi.stubGlobal('alert', vi.fn())
  mocks.getAutomation.mockReturnValue(baseAutomation)
  mocks.getRunsForAutomation.mockReturnValue([
    { id: 'r1', status: 'success', startedAt: 1700000000000, duration: 1200, tokens: 44 },
  ])
  mocks.getEmailLogs.mockReturnValue([])
  mocks.sendResendNotification.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('AutomationDetailPage notification and modal feedback', () => {
  it('warns when a test email is attempted without a recipient', async () => {
    let recipient = 'ops@example.com'
    const automation = { ...baseAutomation }
    Object.defineProperty(automation, 'notificationEmail', {
      configurable: true,
      get: () => recipient,
    })
    mocks.getAutomation.mockReturnValue(automation)
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByRole('tab', { name: /Email & Delivery Logs/ }))

    const send = screen.getByRole('button', { name: 'Send Test Email' })
    expect(send).toBeEnabled()
    recipient = ''
    fireEvent.click(send)

    expect(window.alert).toHaveBeenCalledWith(
      'Please configure a recipient email first by editing this automation.'
    )
    expect(mocks.sendResendNotification).not.toHaveBeenCalled()
  })

  it('clears the successful test-email notice when its reset timer fires', async () => {
    const timeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })
    fireEvent.click(screen.getByRole('tab', { name: /Email & Delivery Logs/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Send Test Email' }))

    expect(
      await screen.findByText('Test email dispatched successfully via Resend!')
    ).toBeInTheDocument()
    const resetTimer = timeoutSpy.mock.calls.find((call) => call[1] === 4000)
    expect(resetTimer).toBeTruthy()
    act(() => resetTimer[0]())

    expect(
      screen.queryByText('Test email dispatched successfully via Resend!')
    ).not.toBeInTheDocument()
  })

  it('opens and closes both the edit form and the run drawer', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Daily digest' })

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByText('Edit modal')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close edit modal' }))
    expect(screen.queryByText('Edit modal')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: /Email & Delivery Logs/ }))
    fireEvent.click(screen.getByRole('tab', { name: /Execution History/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Inspect Output' }))
    expect(screen.getByText('Run drawer: r1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close run drawer' }))
    expect(screen.queryByText('Run drawer: r1')).not.toBeInTheDocument()
  })
})
