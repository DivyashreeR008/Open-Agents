import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  nextRunAt: NOW + 1000,
  hasKey: true,
}

const skippedRun = {
  id: 'r1',
  automationId: 'auto_1',
  automationName: 'Morning digest',
  agentName: 'Summarizer',
  status: 'skipped',
  skippedCount: 2,
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
  svc.loadAutomations.mockReturnValue([automation])
  svc.loadRuns.mockReturnValue([skippedRun])
})

describe('AutomationsPage skipped banner plural copy', () => {
  it('uses plural nouns when only skipped runs are reported', () => {
    renderPage()

    const banner = document.getElementById('missed-runs-banner')
    expect(banner).not.toBeNull()
    expect(banner.querySelector('h4')).toHaveTextContent(
      '2 scheduled runs were skipped across 1 automation'
    )
  })
})
