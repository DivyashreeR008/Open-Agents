import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const svc = vi.hoisted(() => ({
  loadAutomations: vi.fn(),
  loadRuns: vi.fn(),
  toggleAutomation: vi.fn(),
  deleteAutomation: vi.fn(),
  runAutomationNow: vi.fn(),
  initAutomationEngine: vi.fn(),
}))

vi.mock('../lib/automationsService', () => svc)
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/CreateAutomationModal', () => ({ default: () => null }))

import AutomationsPage from './AutomationsPage'

const NOW = Date.now()
const automation = {
  id: 'auto_1',
  name: 'Morning digest',
  agentId: 'a1',
  agentName: 'Summarizer',
  category: 'General',
  provider: 'openai',
  model: 'gpt-4o',
  schedule: 'daily',
  cron: '0 9 * * *',
  enabled: true,
  inputs: {},
  emailNotification: false,
  createdAt: NOW - 1000,
  lastRunAt: NOW - 1000,
  nextRunAt: NOW - 1000,
  hasKey: true,
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
  vi.stubGlobal('alert', vi.fn())
  svc.loadAutomations.mockReturnValue([automation])
  svc.loadRuns.mockReturnValue([])
  svc.runAutomationNow.mockRejectedValue('engine offline')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('AutomationsPage run failure fallback', () => {
  it('alerts a generic failure when the rejection carries no message', async () => {
    renderPage()

    fireEvent.click(screen.getByTitle('Execute Autopilot Run Now'))

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Run failed'))
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /Running/ })).not.toBeInTheDocument()
    )
  })
})
