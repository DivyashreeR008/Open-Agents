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
        title: 'Alpha chain',
        description: 'A research path',
        agents: [],
        usage_count: 0,
      },
    ],
    error: null,
  })
})

describe('WorkflowLibrary whitespace search', () => {
  it('treats a whitespace-only query as no filter instead of no results', async () => {
    render(
      <MemoryRouter>
        <WorkflowLibrary />
      </MemoryRouter>
    )

    expect(await screen.findByText('Alpha chain')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Search workflows'), {
      target: { value: '   ' },
    })

    expect(screen.getByText('Alpha chain')).toBeInTheDocument()
    expect(screen.queryByText('No workflows found')).not.toBeInTheDocument()
  })
})
