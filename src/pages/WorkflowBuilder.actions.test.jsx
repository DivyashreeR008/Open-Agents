import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const agents = [
  { id: 'a1', name: 'Alpha', category: 'Research', icon: 'search' },
  { id: 'a2', name: 'Beta', category: 'Writing', icon: 'pen' },
]
const saveWorkflow = vi.hoisted(() => vi.fn())

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({ saveWorkflow }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowBuilder from './WorkflowBuilder'

function Destination({ label }) {
  const location = useLocation()
  const workflow = location.state?.workflow
  return (
    <div>
      {label}: {workflow ? `${workflow.title} / ${workflow.agents?.join(',')} / ${workflow.id ?? 'draft'} / ${location.state.initialInput ?? 'none'}` : location.pathname}
    </div>
  )
}

function renderPage(state = {}) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/build', state }]}>
      <Routes>
        <Route path="/workflows" element={<Destination label="Library" />} />
        <Route path="/workflows/build" element={<WorkflowBuilder />} />
        <Route path="/workflows/preview/run" element={<Destination label="Runner" />} />
      </Routes>
    </MemoryRouter>
  )
}

function fillForm() {
  fireEvent.change(screen.getByLabelText(/Workflow Title/), { target: { value: '  Research flow  ' } })
  fireEvent.change(screen.getByLabelText(/Description/), { target: { value: '  Find and write  ' } })
  fireEvent.click(screen.getByRole('button', { name: /Add first agent/ }))
  fireEvent.click(screen.getByRole('button', { name: /Alpha/ }))
}

beforeEach(() => vi.clearAllMocks())

describe('WorkflowBuilder actions', () => {
  it('saves trimmed fields and ordered ids then returns to the library', async () => {
    saveWorkflow.mockResolvedValue({ data: { id: 'w1' } })
    renderPage()
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Save Workflow' }))
    expect(await screen.findByText('Library: /workflows')).toBeInTheDocument()
    expect(saveWorkflow).toHaveBeenCalledWith({
      title: 'Research flow', description: 'Find and write', agents: ['a1'],
    })
  })

  it('keeps the builder open and reports a save failure', async () => {
    saveWorkflow.mockResolvedValue({ error: new Error('offline') })
    renderPage()
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Save Workflow' }))
    expect(await screen.findByText('Failed to save workflow. Check your Supabase connection.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Build a Workflow' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Workflow' })).toBeEnabled()
  })

  it('runs an unsaved draft with the prefilled input', async () => {
    renderPage({ preFilledOutput: 'Previous research' })
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Run Without Saving' }))
    expect(await screen.findByText('Runner: Research flow / a1 / draft / Previous research')).toBeInTheDocument()
  })

  it('returns to the library from the header without saving', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Back to workflows' }))
    expect(screen.getByText('Library: /workflows')).toBeInTheDocument()
    expect(saveWorkflow).not.toHaveBeenCalled()
  })
})
