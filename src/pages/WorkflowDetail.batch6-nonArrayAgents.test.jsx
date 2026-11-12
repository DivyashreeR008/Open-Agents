import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  subscribeToWorkflow: vi.fn(() => ({})),
  removeChannel: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: mocks.fetchWorkflowById,
  subscribeToWorkflow: mocks.subscribeToWorkflow,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowDetail from './WorkflowDetail'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.subscribeToWorkflow.mockReturnValue({})
})

describe('WorkflowDetail corrupt agent list', () => {
  it('renders a non-array agents value as an empty sequence without crashing', async () => {
    mocks.fetchWorkflowById.mockResolvedValue({
      data: {
        id: 'w1',
        title: 'Corrupt detail',
        description: '',
        agents: 'agent-one',
        usage_count: 0,
      },
      error: null,
    })

    render(
      <MemoryRouter initialEntries={['/workflows/w1']}>
        <Routes>
          <Route path="/workflows/:id" element={<WorkflowDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByRole('heading', { name: 'Corrupt detail' })).toBeInTheDocument()
    expect(screen.getByText('0 agents')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Workflow/ })).toBeInTheDocument()
  })
})
