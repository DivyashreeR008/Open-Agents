import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  subscribeToWorkflow: vi.fn(() => ({})),
  removeChannel: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: mocks.fetchWorkflowById,
  subscribeToWorkflow: mocks.subscribeToWorkflow,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowDetail from './WorkflowDetail'

function RunnerMarker() {
  const location = useLocation()
  return <div>Runner: {location.state?.workflow?.title}</div>
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows/w1']}>
      <Routes>
        <Route path="/workflows" element={<div>Workflow library</div>} />
        <Route path="/workflows/:id" element={<WorkflowDetail />} />
        <Route path="/workflows/:id/run" element={<RunnerMarker />} />
      </Routes>
    </MemoryRouter>
  )
}

afterEach(() => vi.restoreAllMocks())

describe('WorkflowDetail navigation', () => {
  it('passes the loaded workflow to the runner', async () => {
    mocks.fetchWorkflowById.mockResolvedValue({
      data: { id: 'w1', title: 'Research chain', agents: [], usage_count: 0 },
    })
    renderPage()
    await screen.findByRole('heading', { name: 'Research chain' })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))
    expect(screen.getByText('Runner: Research chain')).toBeInTheDocument()
  })

  it('returns to the library from the header', async () => {
    mocks.fetchWorkflowById.mockResolvedValue({ data: { id: 'w1', title: 'Chain', agents: [], usage_count: 0 } })
    renderPage()
    await screen.findByRole('heading', { name: 'Chain' })
    fireEvent.click(screen.getByRole('button', { name: /Workflow Library/ }))
    expect(screen.getByText('Workflow library')).toBeInTheDocument()
  })

  it('clears the copied label after the confirmation window', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    mocks.fetchWorkflowById.mockResolvedValue({ data: { id: 'w1', title: 'Chain', agents: [], usage_count: 0 } })
    renderPage()
    await screen.findByRole('heading', { name: 'Chain' })
    fireEvent.click(screen.getByRole('button', { name: /Share/ }))
    await screen.findByRole('button', { name: /Copied!/ })
    await waitFor(() => expect(screen.getByRole('button', { name: /Share/ })).toBeInTheDocument(), { timeout: 3000 })
  })
})
