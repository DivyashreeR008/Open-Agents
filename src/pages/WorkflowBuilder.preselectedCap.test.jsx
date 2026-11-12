import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agents = Array.from({ length: 6 }, (_, index) => ({
  id: `a${index + 1}`,
  name: `Agent ${index + 1}`,
  category: 'Research',
  icon: 'search',
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({ saveWorkflow: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowBuilder from './WorkflowBuilder'

describe('WorkflowBuilder preselected suite capacity', () => {
  it('caps a suite import at the five-agent workflow limit', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/workflows/build',
            state: { preselectedAgents: agents.map((agent) => agent.id) },
          },
        ]}
      >
        <Routes>
          <Route path="/workflows/build" element={<WorkflowBuilder />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('Suite imported!')).toBeInTheDocument()
    expect(screen.getByText('5/5 agents')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Remove / })).toHaveLength(5)
    expect(screen.queryByRole('button', { name: /Add (first|next) agent/ })).not.toBeInTheDocument()
  })
})
