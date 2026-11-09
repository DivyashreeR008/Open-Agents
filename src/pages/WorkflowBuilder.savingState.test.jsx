import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agents = [{ id: 'a1', name: 'Alpha', category: 'Research', icon: 'search' }]
const saveWorkflow = vi.hoisted(() => vi.fn())

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({ saveWorkflow }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowBuilder from './WorkflowBuilder'

beforeEach(() => vi.clearAllMocks())

describe('WorkflowBuilder saving state', () => {
  it('shows a disabled saving control until the save resolves', async () => {
    let resolveSave
    saveWorkflow.mockReturnValue(
      new Promise((resolve) => {
        resolveSave = resolve
      })
    )

    render(
      <MemoryRouter initialEntries={['/workflows/build']}>
        <Routes>
          <Route path="/workflows" element={<div>Workflow library</div>} />
          <Route path="/workflows/build" element={<WorkflowBuilder />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Workflow Title/), {
      target: { value: 'Pending flow' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Add first agent/ }))
    fireEvent.click(screen.getByRole('button', { name: /Alpha/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Save Workflow' }))

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()

    await act(async () => {
      resolveSave({ data: { id: 'w1' } })
    })

    expect(await screen.findByText('Workflow library')).toBeInTheDocument()
  })
})
