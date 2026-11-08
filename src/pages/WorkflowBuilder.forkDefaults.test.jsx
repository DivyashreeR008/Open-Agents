import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agents = [{ id: 'a1', name: 'Alpha', category: 'Research', icon: 'search' }]

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({ saveWorkflow: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowBuilder from './WorkflowBuilder'

function renderPage(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/build', state }]}>
      <Routes>
        <Route path="/workflows/build" element={<WorkflowBuilder />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('WorkflowBuilder fork defaults', () => {
  it('leaves description and agents empty when the source workflow omits them', async () => {
    renderPage({ forkedWorkflow: { title: 'Bare flow' } })

    expect(await screen.findByDisplayValue('Copy of Bare flow')).toBeInTheDocument()
    expect(screen.getByLabelText(/Description/)).toHaveValue('')
    expect(screen.getByText('0/5 agents')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Remove / })).not.toBeInTheDocument()
  })
})
