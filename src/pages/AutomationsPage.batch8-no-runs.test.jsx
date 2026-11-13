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

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  svc.loadAutomations.mockReturnValue([
    {
      id: 'auto_1',
      name: 'New automation',
      agentName: 'Summarizer',
      enabled: true,
      schedule: 'daily',
      hasKey: true,
      inputs: {},
    },
  ])
  svc.loadRuns.mockReturnValue([])
})

describe('AutomationsPage success rate without history', () => {
  it('shows an explicit no-data state instead of a perfect score', () => {
    render(
      <MemoryRouter>
        <AutomationsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('No runs')).toBeInTheDocument()
    expect(screen.getByText('No executed runs recorded yet')).toBeInTheDocument()
    expect(screen.queryByText('100%')).not.toBeInTheDocument()
  })
})
