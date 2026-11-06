import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const svc = vi.hoisted(() => ({
  automations: [], runs: [],
  loadAutomations: vi.fn(), loadRuns: vi.fn(),
  toggleAutomation: vi.fn(), deleteAutomation: vi.fn(),
  runAutomationNow: vi.fn(), initAutomationEngine: vi.fn(),
}))

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

const now = Date.now()
const automations = [
  {
    id: 'a1', name: 'Daily Digest', agentName: 'Summarizer', category: 'Research',
    enabled: true, schedule: 'daily', cron: '0 9 * * *', provider: 'openai', model: 'gpt-4o',
    emailNotification: true, lastRunAt: now - 60000, nextRunAt: now + (3 * 86400000) + (2 * 3600000),
  },
  {
    id: 'a2', name: 'Weekly Review', agentName: 'Editor', category: 'Writing',
    enabled: false, schedule: 'weekly', cron: '0 10 * * 1', provider: 'anthropic', model: 'claude',
    emailNotification: false, lastRunAt: null, nextRunAt: null,
  },
]
const runs = [
  { id: 'r1', automationId: 'a1', status: 'success' },
  { id: 'r2', automationId: 'a1', status: 'success' },
  { id: 'r3', automationId: 'a2', status: 'success' },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<AutomationsPage />} />
        <Route path="/automations/:id" element={<div>Automation detail</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  svc.automations = automations
  svc.runs = runs
  svc.loadAutomations.mockImplementation(() => svc.automations)
  svc.loadRuns.mockImplementation(() => svc.runs)
  svc.toggleAutomation.mockResolvedValue(undefined)
  svc.deleteAutomation.mockResolvedValue(undefined)
  svc.runAutomationNow.mockResolvedValue(undefined)
})

describe('AutomationsPage card actions', () => {
  it('renders card metadata and per-automation logs', () => {
    renderPage()
    expect(screen.getAllByText('Active')).toHaveLength(1)
    expect(screen.getAllByText('Paused').length).toBeGreaterThan(0)
    expect(screen.getByText('daily (0 9 * * *)')).toBeInTheDocument()
    expect(screen.getByText('weekly (0 10 * * 1)')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getAllByText('Next Autopilot Trigger')[0].parentElement).toHaveTextContent(/in 3d/)
    expect(screen.getAllByText('Next Autopilot Trigger')[1].parentElement).toHaveTextContent('Paused')
    expect(screen.getByText('Logs (2)')).toBeInTheDocument()
    expect(screen.getByText('Logs (1)')).toBeInTheDocument()
  })

  it('toggles and runs an automation, including the busy state', async () => {
    let finishRun
    svc.runAutomationNow.mockReturnValue(new Promise((resolve) => { finishRun = resolve }))
    renderPage()

    fireEvent.click(screen.getAllByTitle('Pause Autopilot')[0])
    await waitFor(() => expect(svc.toggleAutomation).toHaveBeenCalledWith('a1'))
    fireEvent.click(screen.getByTitle('Resume Autopilot'))
    await waitFor(() => expect(svc.toggleAutomation).toHaveBeenCalledWith('a2'))

    fireEvent.click(screen.getAllByTitle('Execute Autopilot Run Now')[0])
    expect(screen.getByRole('button', { name: /Running/ })).toBeDisabled()
    await act(async () => { finishRun() })
    await waitFor(() => expect(screen.queryByRole('button', { name: /Running/ })).not.toBeInTheDocument())
    expect(svc.runAutomationNow).toHaveBeenCalledWith('a1')
  })

  it('requires confirmation before deleting and switches targets safely', async () => {
    renderPage()
    fireEvent.click(screen.getAllByTitle('Delete Automation')[0])
    expect(svc.deleteAutomation).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    fireEvent.click(screen.getAllByTitle('Delete Automation')[0])
    expect(screen.getAllByRole('button', { name: 'Confirm' })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(svc.deleteAutomation).toHaveBeenCalledWith('a2'))
  })

  it('opens edit with the selected record and create with no record', () => {
    const page = renderPage()
    fireEvent.click(screen.getAllByTitle('Edit Automation')[0])
    expect(screen.getByRole('dialog')).toHaveTextContent('Automation form Daily Digest')
    page.unmount()

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Schedule New Agent/ }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Automation form new')
  })
})
