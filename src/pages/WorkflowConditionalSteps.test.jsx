import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflows: vi.fn(),
  fetchWorkflowById: vi.fn(),
  subscribeToAllWorkflows: vi.fn(() => ({})),
  subscribeToWorkflow: vi.fn(() => ({})),
  removeChannel: vi.fn(),
  agents: [
    { id: 'a1', name: 'Router', category: 'Classification', icon: 'search' },
    { id: 'a2', name: 'Writer', category: 'Writing', icon: 'pen' },
  ],
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: mocks.agents }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: mocks.fetchWorkflows,
  fetchWorkflowById: mocks.fetchWorkflowById,
  subscribeToAllWorkflows: mocks.subscribeToAllWorkflows,
  subscribeToWorkflow: mocks.subscribeToWorkflow,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowDetail from './WorkflowDetail'
import WorkflowLibrary from './WorkflowLibrary'

const conditionalStep = {
  type: 'conditional_branch',
  id: 'route',
  condition: '{{ steps.classify.output }}',
  branches: {
    billing: ['a2'],
    default: ['a1'],
  },
}

const workflow = {
  id: 'w1',
  title: 'Conditional chain',
  description: 'Routes requests',
  agents: ['a1', conditionalStep, null, { unknown: true }],
  usage_count: 0,
}

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/workflows/w1']}>
      <Routes>
        <Route path="/workflows/:id" element={<WorkflowDetail />} />
      </Routes>
    </MemoryRouter>
  )

const renderLibrary = () =>
  render(
    <MemoryRouter initialEntries={['/workflows']}>
      <Routes>
        <Route path="/workflows" element={<WorkflowLibrary />} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchWorkflows.mockResolvedValue({ data: [workflow] })
  mocks.fetchWorkflowById.mockResolvedValue({ data: workflow })
})

describe('workflow views with conditional and malformed steps', () => {
  it('renders conditional and malformed entries in the detail sequence', async () => {
    renderDetail()

    expect(await screen.findByRole('heading', { name: 'Conditional chain' })).toBeInTheDocument()
    expect(screen.getByText('Conditional step')).toBeInTheDocument()
    expect(screen.getByText('When {{ steps.classify.output }}')).toBeInTheDocument()
    expect(screen.getByText('Branches: billing, default')).toBeInTheDocument()
    expect(screen.getAllByText('Unavailable step')).toHaveLength(2)
    expect(screen.getByText('4 steps · 1 conditional')).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('[object Object]')
  })

  it('marks conditional entries in library cards and searches their branches', async () => {
    renderLibrary()

    expect(await screen.findByText('Conditional chain')).toBeInTheDocument()
    expect(screen.getByText('Conditional')).toBeInTheDocument()
    expect(screen.getByText('4 steps · 1 conditional · 2 unavailable')).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('[object Object]')

    const search = screen.getByLabelText('Search workflows')
    fireEvent.change(search, { target: { value: 'billing' } })
    expect(screen.getByText('Conditional chain')).toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'Writing' } })
    expect(screen.getByText('Conditional chain')).toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'not-present' } })
    expect(screen.getByText('No workflows found')).toBeInTheDocument()
  })
})
