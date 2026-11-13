import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agents = [
  { id: 'a1', name: 'Alpha', category: 'Research', icon: 'search' },
  { id: 'a2', name: 'Beta', category: 'Writing', icon: 'pen' },
  { id: 'a3', name: 'Gamma', category: 'Analysis', icon: 'chart' },
  { id: 'a4', name: 'Delta', category: 'Data', icon: 'database' },
  { id: 'a5', name: 'Epsilon', category: 'Editing', icon: 'pen' },
  { id: 'a6', name: 'Zeta', category: 'Ops', icon: 'gear' },
]

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

function openPicker() {
  fireEvent.click(screen.getByRole('button', { name: /Add (first|next) agent/ }))
}

function addAgent(name) {
  openPicker()
  fireEvent.click(screen.getByRole('button', { name: new RegExp(name) }))
}

beforeEach(() => vi.clearAllMocks())

describe('WorkflowBuilder agent selection', () => {
  it('searches by name or category and handles no matches', () => {
    renderPage()
    openPicker()
    const search = screen.getByLabelText('Search agents')
    fireEvent.change(search, { target: { value: 'writing' } })
    expect(screen.getByRole('button', { name: /Beta/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Alpha/ })).not.toBeInTheDocument()
    fireEvent.change(search, { target: { value: 'absent' } })
    expect(screen.getByText('No agents found')).toBeInTheDocument()
  })

  it('adds, hides, removes, and prevents duplicate agents', () => {
    renderPage()
    addAgent('Alpha')
    expect(screen.getAllByText('Alpha').length).toBeGreaterThan(0)
    expect(screen.queryByLabelText('Search agents')).not.toBeInTheDocument()

    openPicker()
    fireEvent.change(screen.getByLabelText('Search agents'), { target: { value: 'alpha' } })
    expect(screen.getByText('No agents found')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByLabelText('Search agents')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Remove Alpha' }))
    openPicker()
    expect(screen.getByRole('button', { name: /Alpha/ })).toBeInTheDocument()
  })

  it('dismisses the picker with Escape and returns focus without changing the chain', () => {
    renderPage()
    const trigger = screen.getByRole('button', { name: /Add first agent/ })
    trigger.focus()
    fireEvent.click(trigger)

    expect(screen.getByRole('dialog', { name: 'Choose an agent' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search agents')).toHaveFocus()

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(screen.queryByLabelText('Search agents')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(screen.getByText('0/5 agents')).toBeInTheDocument()
  })

  it('dismisses the picker with its close control and from a backdrop click', () => {
    renderPage()
    openPicker()
    fireEvent.click(screen.getByRole('button', { name: 'Close agent picker' }))
    expect(screen.queryByLabelText('Search agents')).not.toBeInTheDocument()

    openPicker()
    fireEvent.click(document.querySelector('[data-agent-picker-backdrop]'))
    expect(screen.queryByLabelText('Search agents')).not.toBeInTheDocument()
    expect(screen.getByText('0/5 agents')).toBeInTheDocument()
  })

  it('caps the chain at five agents', () => {
    renderPage()
    for (const name of ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']) addAgent(name)
    expect(screen.getByText('5/5 agents')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Add (first|next) agent/ })).not.toBeInTheDocument()
  })

  it('imports known suite agents and ignores unknown ids', async () => {
    renderPage({ preselectedAgents: ['a1', 'missing', 'a2'] })
    expect(await screen.findByText('Suite imported!')).toBeInTheDocument()
    expect(screen.getByText('2/5 agents')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Beta' })).toBeInTheDocument()
    expect(screen.queryByText('missing')).not.toBeInTheDocument()
  })

  it('prefills a forked workflow and preserves chain order', async () => {
    renderPage({
      forkedWorkflow: { title: 'Source flow', description: 'Original copy', agents: ['a2', 'a1'] },
    })
    expect(await screen.findByDisplayValue('Copy of Source flow')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Original copy')).toBeInTheDocument()
    const removeButtons = screen.getAllByRole('button', { name: /^Remove / })
    expect(removeButtons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Remove Beta',
      'Remove Alpha',
    ])
  })
})
