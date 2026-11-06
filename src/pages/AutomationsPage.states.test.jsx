import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const svc = vi.hoisted(() => ({
  automations: [], runs: [],
  loadAutomations: vi.fn(), loadRuns: vi.fn(),
  toggleAutomation: vi.fn(), deleteAutomation: vi.fn(),
  runAutomationNow: vi.fn(), initAutomationEngine: vi.fn(),
}))
const notification = vi.hoisted(() => ({ permission: 'default', request: vi.fn() }))

vi.mock('../lib/automationsService', () => ({
  loadAutomations: svc.loadAutomations,
  loadRuns: svc.loadRuns,
  toggleAutomation: svc.toggleAutomation,
  deleteAutomation: svc.deleteAutomation,
  runAutomationNow: svc.runAutomationNow,
  initAutomationEngine: svc.initAutomationEngine,
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/CreateAutomationModal', () => ({
  default: ({ isOpen, initialData }) => (
    isOpen ? <div role="dialog">Automation form {initialData?.name || 'new'}</div> : null
  ),
}))

import AutomationsPage from './AutomationsPage'

function renderPage() {
  return render(<MemoryRouter><AutomationsPage /></MemoryRouter>)
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  svc.automations = []
  svc.runs = []
  svc.loadAutomations.mockImplementation(() => svc.automations)
  svc.loadRuns.mockImplementation(() => svc.runs)
  notification.permission = 'default'
  notification.request.mockResolvedValue('granted')
})

afterEach(() => vi.unstubAllGlobals())

describe('AutomationsPage empty and notification states', () => {
  it('renders the first-automation state and zero summary counts', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Scheduled Automations' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No automations found' })).toBeInTheDocument()
    expect(screen.getByText(/Put your favorite agents on recurring autopilot/)).toBeInTheDocument()
    expect(screen.getByText('Total Automations').parentElement.nextElementSibling).toHaveTextContent('0')
    expect(screen.getByText('Active Autopilots').parentElement.nextElementSibling).toHaveTextContent('0')
    expect(svc.initAutomationEngine).toHaveBeenCalledTimes(1)
  })

  it('opens the create form from the empty state and the header', () => {
    const first = renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Schedule Your First Agent' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Automation form new')
    first.unmount()

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Schedule New Agent/ }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Automation form new')
  })

  it('requests notification permission and hides the prompt when granted', async () => {
    vi.stubGlobal('Notification', { permission: 'default', requestPermission: notification.request })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Enable Alerts/ }))
    expect(notification.request).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('button', { name: /Enable Alerts/ })).not.toBeInTheDocument())
  })

  it('omits the prompt for denied and unsupported browsers', () => {
    vi.stubGlobal('Notification', { permission: 'denied', requestPermission: notification.request })
    const denied = renderPage()
    expect(screen.queryByRole('button', { name: /Enable Alerts/ })).not.toBeInTheDocument()
    denied.unmount()

    if ('Notification' in window) delete window.Notification
    renderPage()
    expect(screen.queryByRole('button', { name: /Enable Alerts/ })).not.toBeInTheDocument()
  })
})
