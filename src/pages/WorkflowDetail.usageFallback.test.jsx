import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
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
  mocks.fetchWorkflowById.mockReset()
  mocks.subscribeToWorkflow.mockReset()
  mocks.removeChannel.mockReset()
})

describe('WorkflowDetail usage fallbacks', () => {
  it('treats a missing usage count as zero and ignores updates without one', async () => {
    let notify
    mocks.fetchWorkflowById.mockResolvedValue({
      data: { id: 'w1', title: 'Fallback flow', agents: ['a1'] },
      error: null,
    })
    mocks.subscribeToWorkflow.mockImplementation((id, handler) => {
      notify = handler
      return { id }
    })

    render(
      <MemoryRouter initialEntries={['/workflows/w1']}>
        <Routes>
          <Route path="/workflows/:id" element={<WorkflowDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByRole('heading', { name: 'Fallback flow' })).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()

    act(() => notify({ new: {} }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
