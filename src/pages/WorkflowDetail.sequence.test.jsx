import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  subscribeToWorkflow: vi.fn(),
  removeChannel: vi.fn(),
  agents: [
    { id: 'a1', name: 'Researcher', category: 'Research', icon: 'search' },
    { id: 'a2', name: 'Writer', category: 'Writing', icon: 'pen' },
  ],
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: mocks.agents }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: mocks.fetchWorkflowById,
  subscribeToWorkflow: mocks.subscribeToWorkflow,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowDetail from './WorkflowDetail'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows/w1']}>
      <Routes>
        <Route path="/workflows/:id" element={<WorkflowDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => vi.clearAllMocks())
afterEach(() => vi.restoreAllMocks())

describe('WorkflowDetail usage and sequence', () => {
  it('applies realtime usage updates and removes the channel', async () => {
    let callback
    mocks.subscribeToWorkflow.mockImplementation((id, next) => {
      callback = next
      return { id: 'channel' }
    })
    mocks.fetchWorkflowById.mockResolvedValue({ data: { id: 'w1', title: 'Chain', agents: ['a1'], usage_count: 3 } })
    const { unmount } = renderPage()
    await screen.findByRole('heading', { name: 'Chain' })
    expect(screen.getByText('3')).toBeInTheDocument()

    act(() => callback({ new: { usage_count: 9 } }))
    expect(screen.getByText('9')).toBeInTheDocument()

    unmount()
    expect(mocks.removeChannel).toHaveBeenCalledWith({ id: 'channel' })
  })

  it('renders known and unknown agents in workflow order', async () => {
    mocks.subscribeToWorkflow.mockReturnValue({})
    mocks.fetchWorkflowById.mockResolvedValue({ data: { id: 'w1', title: 'Chain', agents: ['a1', 'missing', 'a2'], usage_count: 0 } })
    renderPage()
    await screen.findByRole('heading', { name: 'Chain' })
    expect(screen.getByText('Researcher')).toBeInTheDocument()
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('missing')).toBeInTheDocument()
    expect(screen.getAllByText(/3 agents/).length).toBeGreaterThan(0)
  })

  it('uses the singular agent label and the chained-output note', async () => {
    mocks.subscribeToWorkflow.mockReturnValue({})
    mocks.fetchWorkflowById.mockResolvedValue({ data: { id: 'w1', title: 'Chain', agents: ['a1'], usage_count: 0 } })
    renderPage()
    await screen.findByRole('heading', { name: 'Chain' })
    expect(screen.getAllByText('1 agent').length).toBeGreaterThan(0)
    expect(screen.getByText(/Each agent's output becomes the input/)).toBeInTheDocument()
  })
})
