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

describe('WorkflowBuilder forked workflow capacity', () => {
  it('caps a forked workflow at the five-agent limit', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/workflows/build',
            state: {
              forkedWorkflow: {
                id: 'w1',
                title: 'Six agents',
                description: 'Too many agents',
                agents: agents.map((agent) => agent.id),
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/workflows/build" element={<WorkflowBuilder />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByDisplayValue('Copy of Six agents')).toBeInTheDocument()
    expect(screen.getByText('5/5 agents')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Remove / })).toHaveLength(5)
  })
})
