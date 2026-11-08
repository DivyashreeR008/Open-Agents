import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  subscribeToWorkflow: vi.fn(),
  removeChannel: vi.fn(),
}))

vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: mocks.fetchWorkflowById,
  subscribeToWorkflow: mocks.subscribeToWorkflow,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowDetail from './WorkflowDetail'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchWorkflowById.mockResolvedValue({
    data: { id: 'w1', title: 'Bare flow' },
    error: null,
  })
  mocks.subscribeToWorkflow.mockReturnValue({ id: 'channel' })
})

describe('WorkflowDetail missing description', () => {
  it('omits the description paragraph and treats missing agents as zero', async () => {
    render(
      <MemoryRouter initialEntries={['/workflows/w1']}>
        <Routes>
          <Route path="/workflows/:id" element={<WorkflowDetail />} />
        </Routes>
      </MemoryRouter>
    )

    const heading = await screen.findByRole('heading', { name: 'Bare flow' })
    expect(heading.parentElement.querySelectorAll('p')).toHaveLength(0)
    expect(screen.getByText('0 agents')).toBeInTheDocument()
  })
})
