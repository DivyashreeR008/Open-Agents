import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflows: vi.fn(),
  subscribeToAllWorkflows: vi.fn(() => ({})),
}))

const agents = [{ id: 'a1', name: 'Alpha', category: 'Research' }]

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: mocks.fetchWorkflows,
  subscribeToAllWorkflows: mocks.subscribeToAllWorkflows,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: vi.fn() } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowLibrary from './WorkflowLibrary'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchWorkflows.mockResolvedValue({
    data: [{ id: 'w1', title: 'Bare flow', description: 'No agents here', usage_count: 0 }],
  })
})

describe('WorkflowLibrary search without an agents field', () => {
  it('treats a missing agents list as empty when matching categories', async () => {
    render(
      <MemoryRouter initialEntries={['/workflows']}>
        <Routes>
          <Route path="/workflows" element={<WorkflowLibrary />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('Bare flow')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search workflows'), { target: { value: 'research' } })
    expect(screen.getByText('No workflows found')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search workflows'), { target: { value: 'bare' } })
    expect(screen.getByText('Bare flow')).toBeInTheDocument()
  })
})
