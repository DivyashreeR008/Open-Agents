import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fetchWorkflows: vi.fn(),
  subscribeToAllWorkflows: vi.fn(() => ({})),
  removeChannel: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: mocks.fetchWorkflows,
  subscribeToAllWorkflows: mocks.subscribeToAllWorkflows,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowLibrary from './WorkflowLibrary'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchWorkflows.mockResolvedValue({
    data: [
      {
        id: 'w1',
        title: 'Corrupt chain',
        description: 'Stored agents value is not a list',
        agents: 'agent-one',
        usage_count: 1,
      },
    ],
    error: null,
  })
})

describe('WorkflowLibrary corrupt agent list', () => {
  it('treats a non-array agents value as an empty chain while rendering and searching', async () => {
    render(
      <MemoryRouter>
        <WorkflowLibrary />
      </MemoryRouter>
    )

    expect(await screen.findByRole('heading', { name: 'Corrupt chain' })).toBeInTheDocument()
    expect(screen.getByText('0 agents')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search workflows'), {
      target: { value: 'nothing-matches' },
    })

    expect(screen.getByRole('heading', { name: 'No workflows found' })).toBeInTheDocument()
  })
})
