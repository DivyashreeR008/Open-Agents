import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    data: [{ id: 'w1', title: 'Solo flow', description: 'One agent', agents: ['a1'] }],
  })
})

describe('WorkflowLibrary single-agent sequence', () => {
  it('does not render a connector arrow after the final agent', async () => {
    render(
      <MemoryRouter initialEntries={['/workflows']}>
        <Routes>
          <Route path="/workflows" element={<WorkflowLibrary />} />
        </Routes>
      </MemoryRouter>
    )

    const pill = await screen.findByText('Alpha')
    expect(pill.parentElement.querySelector('svg')).toBeNull()
  })
})
