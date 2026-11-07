import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const svc = vi.hoisted(() => ({
  automations: [],
  runs: [],
  loadAutomations: vi.fn(),
  loadRuns: vi.fn(),
  toggleAutomation: vi.fn(),
  deleteAutomation: vi.fn(),
  runAutomationNow: vi.fn(),
  initAutomationEngine: vi.fn(),
}))

vi.mock('../lib/automationsService', () => svc)
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/CreateAutomationModal', () => ({
  default: ({ isOpen, initialData, onClose }) =>
    isOpen ? (
      <div role="dialog">
        Form: {initialData?.name || 'new'}
        <button onClick={onClose}>Close form</button>
      </div>
    ) : null,
}))

import AutomationsPage from './AutomationsPage'

const NOW = Date.now()
const automations = [
  {
    id: 'due',
    name: 'Due Digest',
    agentName: 'Summarizer',
    category: 'Research',
    enabled: true,
    schedule: 'daily',
    cron: '0 9 * * *',
    provider: 'openai',
    model: 'gpt-4o',
    emailNotification: false,
    lastRunAt: NOW - 60000,
    nextRunAt: NOW - 1000,
  },
  {
    id: 'hours',
    name: 'Hourly Review',
    agentName: 'Editor',
    category: 'Writing',
    enabled: true,
    schedule: 'hourly',
    cron: '0 * * * *',
    provider: 'openai',
    model: 'gpt-4o',
    emailNotification: false,
    lastRunAt: null,
    nextRunAt: NOW + (2 * 60 + 30) * 60000 + 30000,
  },
  {
    id: 'days',
    name: 'Weekly Review',
    agentName: 'Editor',
    category: 'Writing',
    enabled: true,
    schedule: 'weekly',
    cron: '0 10 * * 1',
    provider: 'openai',
    model: 'gpt-4o',
    emailNotification: false,
    lastRunAt: null,
    nextRunAt: NOW + (2 * 24 + 3) * 3600000 + 30000,
  },
  {
    id: 'paused',
    name: 'Paused Plan',
    agentName: 'Planner',
    category: 'Research',
    enabled: false,
    schedule: 'daily',
    cron: '0 9 * * *',
    provider: 'openai',
    model: 'gpt-4o',
    emailNotification: false,
    lastRunAt: null,
    nextRunAt: NOW + 3600000,
  },
]

const missedRun = {
  id: 'missed-1',
  automationId: 'due',
  automationName: 'Due Digest',
  agentName: 'Summarizer',
  status: 'missed',
  missedCount: 1,
  detectedAt: NOW - 1000,
  startedAt: NOW - 1000,
  duration: 0,
  tokens: 0,
  output: '',
  error: null,
  emailSent: false,
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AutomationsPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  svc.loadAutomations.mockReturnValue(automations)
  svc.loadRuns.mockReturnValue([missedRun])
  svc.toggleAutomation.mockResolvedValue(undefined)
  svc.deleteAutomation.mockResolvedValue(undefined)
  svc.runAutomationNow.mockResolvedValue(undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('AutomationsPage run and banner feedback', () => {
  it('renders due, hour, day, and paused countdown copy', () => {
    renderPage()
    expect(screen.getByText('Due now')).toBeInTheDocument()
    expect(screen.getByText('in 2h 30m')).toBeInTheDocument()
    expect(screen.getByText('in 2d 3h')).toBeInTheDocument()
    expect(screen.getAllByText('Paused').length).toBeGreaterThanOrEqual(2)
  })

  it('alerts a run-now rejection and restores the action', async () => {
    vi.stubGlobal('alert', vi.fn())
    svc.runAutomationNow.mockRejectedValue(new Error('engine offline'))
    renderPage()

    fireEvent.click(screen.getAllByTitle('Execute Autopilot Run Now')[0])

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('engine offline'))
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /Running/ })).not.toBeInTheDocument()
    )
  })

  it('survives storage exceptions while reading and dismissing the missed banner', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    renderPage()
    expect(screen.getByRole('status')).toHaveTextContent(/scheduled run was missed/)

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss missed runs notice' }))
    expect(screen.queryByText(/scheduled run was missed/)).not.toBeInTheDocument()
  })

  it('closes the edit form and resets the selected record', () => {
    renderPage()
    fireEvent.click(screen.getAllByTitle('Edit Automation')[0])
    expect(screen.getByRole('dialog')).toHaveTextContent('Form: Due Digest')

    fireEvent.click(screen.getByRole('button', { name: 'Close form' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Schedule New Agent/ }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Form: new')
  })
})
