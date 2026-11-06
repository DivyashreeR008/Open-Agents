import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

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

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows']}>
      <Routes>
        <Route path="/workflows" element={<WorkflowLibrary />} />
        <Route path="/workflows/build" element={<div>Workflow builder</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => vi.clearAllMocks())

describe('WorkflowLibrary states', () => {
  it('renders the loading state before the fetch settles', () => {
    mocks.fetchWorkflows.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText(/Loading workflows/)).toBeInTheDocument()
  })

  it('renders the connection error without the empty state', async () => {
    mocks.fetchWorkflows.mockResolvedValue({ error: new Error('offline') })
    renderPage()
    expect(await screen.findByText(/Failed to load workflows/)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'No workflows yet' })).not.toBeInTheDocument()
  })

  it('renders the first-workflow action for an empty catalogue', async () => {
    mocks.fetchWorkflows.mockResolvedValue({ data: [] })
    renderPage()
    expect(await screen.findByRole('heading', { name: 'No workflows yet' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Build a workflow' })).toBeInTheDocument()
  })

  it('restores the full list when a search is cleared', async () => {
    mocks.fetchWorkflows.mockResolvedValue({
      data: [{ id: 'w1', title: 'Launch', description: 'ship', agents: [], usage_count: 0 }],
    })
    renderPage()
    await screen.findByRole('heading', { name: 'Launch' })
    const input = screen.getByLabelText('Search workflows')
    fireEvent.change(input, { target: { value: 'nothing' } })
    expect(screen.getByRole('heading', { name: 'No workflows found' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('heading', { name: 'Launch' })).toBeInTheDocument()
  })
})
