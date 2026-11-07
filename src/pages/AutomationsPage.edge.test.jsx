import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
  nextRunAt: NOW + 1000,
  hasKey: true,
}
const missedRun = {
  id: 'r1',
  automationId: 'auto_1',
  automationName: 'Morning digest',
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

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  svc.loadAutomations.mockReturnValue([automation])
  svc.loadRuns.mockReturnValue([missedRun])
})

describe('AutomationsPage dismissed-banner storage edge', () => {
  it('ignores a corrupt dismissal timestamp and still reports recent missed runs', () => {
    localStorage.setItem('oa_missed_runs_banner_dismissed_at', 'not-a-number')

    render(
      <MemoryRouter>
        <AutomationsPage />
      </MemoryRouter>
    )

    const banner = document.getElementById('missed-runs-banner')
    expect(banner).not.toBeNull()
    expect(banner).toHaveTextContent('1 scheduled run was missed')
    expect(screen.getByRole('button', { name: /Dismiss missed runs notice/i })).toBeInTheDocument()
  })
})
