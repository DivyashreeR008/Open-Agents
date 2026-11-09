import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
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
const makeAutomation = (id, name) => ({
  id,
  name,
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
})

const makeMissedRun = (id, automationId, name) => ({
  id,
  automationId,
  automationName: name,
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
})

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  svc.loadAutomations.mockReturnValue([
    makeAutomation('auto_1', 'First digest'),
    makeAutomation('auto_2', 'Second digest'),
  ])
  svc.loadRuns.mockReturnValue([
    makeMissedRun('r1', 'auto_1', 'First digest'),
    makeMissedRun('r2', 'auto_2', 'Second digest'),
  ])
})

describe('AutomationsPage missed banner automation plural', () => {
  it('counts missed runs across more than one automation', () => {
    render(
      <MemoryRouter>
        <AutomationsPage />
      </MemoryRouter>
    )

    const banner = document.getElementById('missed-runs-banner')
    expect(banner).not.toBeNull()
    expect(banner).toHaveTextContent('2 scheduled runs were missed across 2 automations')
  })
})
