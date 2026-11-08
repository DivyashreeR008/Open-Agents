import { act, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fetchWorkflows: vi.fn(),
  subscribeToAllWorkflows: vi.fn(),
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

const workflows = [
  {
    id: 'w1',
    title: 'Complete plan',
    description: 'Has metadata',
    agents: [],
    usage_count: 2,
  },
  {
    id: 'w2',
    title: 'Sparse plan',
  },
]

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows']}>
      <WorkflowLibrary />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchWorkflows.mockResolvedValue({ data: workflows })
  mocks.subscribeToAllWorkflows.mockReturnValue({ id: 'channel' })
})

describe('WorkflowLibrary missing workflow metadata', () => {
  it('defaults absent usage and agent fields and ignores updates for other workflows', async () => {
    let realtimeHandler
    mocks.subscribeToAllWorkflows.mockImplementation((handler) => {
      realtimeHandler = handler
      return { id: 'channel' }
    })

    renderPage()

    const sparseHeading = await screen.findByRole('heading', { name: 'Sparse plan' })
    const sparseCard = sparseHeading.closest('.flex.flex-col')
    expect(sparseCard).not.toBeNull()
    expect(within(sparseCard).getByText('0')).toBeInTheDocument()
    expect(within(sparseCard).getByText('0 agents')).toBeInTheDocument()

    act(() => realtimeHandler({ new: { id: 'other-workflow', usage_count: 99 } }))

    expect(screen.queryByText('99')).not.toBeInTheDocument()
    expect(within(sparseCard).getByText('0')).toBeInTheDocument()
  })
})
