import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const agents = Array.from({ length: 31 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return {
    id: `a${index + 1}`,
    name: `Agent ${number}`,
    category: index % 2 === 0 ? 'Research' : 'Writing',
    icon: 'search',
  }
})
const saveWorkflow = vi.hoisted(() => vi.fn())

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({ saveWorkflow }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowBuilder from './WorkflowBuilder'

function RunnerState() {
  const location = useLocation()
  return <pre data-testid="runner-state">{JSON.stringify(location.state)}</pre>
}

function renderPage(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/build', state }]}>
      <Routes>
        <Route path="/workflows/build" element={<WorkflowBuilder />} />
        <Route path="/workflows/preview/run" element={<RunnerState />} />
      </Routes>
    </MemoryRouter>
  )
}

function openPicker() {
  fireEvent.click(screen.getByRole('button', { name: /Add (first|next) agent/ }))
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('WorkflowBuilder catalogue and blank draft edges', () => {
  it('pages through a catalogue larger than the picker window', () => {
    renderPage()
    openPicker()

    expect(screen.getByRole('button', { name: /Agent 30/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Agent 31/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show 1 more of 31' }))

    expect(screen.getByRole('button', { name: /Agent 31/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Show \d+ more of/ })).not.toBeInTheDocument()
  })

  it('keeps the suite banner but selects nothing when no id is known', async () => {
    renderPage({ preselectedAgents: ['missing-one', 'missing-two'] })

    expect(await screen.findByText('Suite imported!')).toBeInTheDocument()
    expect(screen.getByText('0/5 agents')).toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: /^Remove / })).toEqual([])
    expect(screen.getByRole('button', { name: 'Save Workflow' })).toBeDisabled()
  })

  it('runs a minimal draft with an empty description and no prefilled input', async () => {
    renderPage()

    fireEvent.change(screen.getByLabelText(/Workflow Title/), {
      target: { value: '  Minimal flow  ' },
    })
    openPicker()
    fireEvent.click(screen.getByRole('button', { name: /Agent 01/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Run Without Saving' }))

    await waitFor(() => expect(screen.getByTestId('runner-state')).toBeInTheDocument())
    expect(JSON.parse(screen.getByTestId('runner-state').textContent)).toEqual({
      workflow: {
        id: null,
        title: 'Minimal flow',
        description: '',
        agents: ['a1'],
      },
      initialInput: '',
    })
    expect(saveWorkflow).not.toHaveBeenCalled()
  })
})
