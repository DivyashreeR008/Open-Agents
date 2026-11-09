import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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

describe('WorkflowDetail missing route id', () => {
  it('skips the realtime subscription when no workflow id is in the route', async () => {
    mocks.fetchWorkflowById.mockResolvedValue({ data: null, error: null })

    render(
      <MemoryRouter>
        <WorkflowDetail />
      </MemoryRouter>
    )

    expect(await screen.findByText('Workflow not found.')).toBeInTheDocument()
    expect(mocks.fetchWorkflowById).toHaveBeenCalledWith(undefined)
    expect(mocks.subscribeToWorkflow).not.toHaveBeenCalled()
    expect(mocks.removeChannel).not.toHaveBeenCalled()
  })
})
