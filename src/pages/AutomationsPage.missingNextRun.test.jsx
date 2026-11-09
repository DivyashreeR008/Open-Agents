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

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  svc.loadAutomations.mockReturnValue([
    {
      id: 'auto_1',
      name: 'No next run',
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
      createdAt: Date.now() - 1000,
      lastRunAt: Date.now() - 1000,
      hasKey: true,
    },
  ])
  svc.loadRuns.mockReturnValue([])
})

describe('AutomationsPage missing next run', () => {
  it('renders an em dash for an enabled automation without a next trigger', () => {
    render(
      <MemoryRouter>
        <AutomationsPage />
      </MemoryRouter>
    )

    const label = screen.getByText('Next Autopilot Trigger')
    expect(label.parentElement).toHaveTextContent('Next Autopilot Trigger—')
  })
})
