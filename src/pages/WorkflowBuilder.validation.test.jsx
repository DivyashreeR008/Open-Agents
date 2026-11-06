import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agents = [
  { id: 'a1', name: 'Alpha', category: 'Research', icon: 'search' },
  { id: 'a2', name: 'Beta', category: 'Writing', icon: 'pen' },
]
const saveWorkflow = vi.hoisted(() => vi.fn())

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({ saveWorkflow }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowBuilder from './WorkflowBuilder'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows/build']}>
      <Routes>
        <Route path="/workflows" element={<div>Workflow library</div>} />
        <Route path="/workflows/build" element={<WorkflowBuilder />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => vi.clearAllMocks())

describe('WorkflowBuilder validation and preview', () => {
  it('starts with disabled actions and enables them after a title and agent', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Build a Workflow' })).toBeInTheDocument()
    expect(screen.getByText('Add at least one agent to build a workflow')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Workflow' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Run Without Saving' })).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/Workflow Title/), {
      target: { value: 'Research flow' },
    })
    expect(screen.getByRole('button', { name: 'Save Workflow' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /Add first agent/ }))
    fireEvent.click(screen.getByRole('button', { name: /Alpha/ }))
    expect(screen.getByRole('button', { name: 'Save Workflow' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Run Without Saving' })).toBeEnabled()
  })

  it('tracks the description count and clears the field', () => {
    renderPage()
    const description = screen.getByLabelText(/Description/)
    fireEvent.change(description, { target: { value: 'Short brief' } })
    expect(screen.getByText('11 characters')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear description' }))
    expect(description).toHaveValue('')
    expect(description).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Clear description' })).not.toBeInTheDocument()
  })

  it('renders the live preview and estimated runtime', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText(/Workflow Title/), {
      target: { value: 'Research flow' },
    })
    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'Find and write' } })
    fireEvent.click(screen.getByRole('button', { name: /Add first agent/ }))
    fireEvent.click(screen.getByRole('button', { name: /Alpha/ }))

    expect(screen.getByText('Workflow Preview')).toBeInTheDocument()
    expect(screen.getByText('Research flow')).toBeInTheDocument()
    expect(screen.getAllByText('Find and write').length).toBeGreaterThan(0)
    expect(screen.getByText('Sequential')).toBeInTheDocument()
    expect(screen.getByText('~20 sec')).toBeInTheDocument()
    expect(screen.getByText('1/5 agents')).toBeInTheDocument()
  })
})
