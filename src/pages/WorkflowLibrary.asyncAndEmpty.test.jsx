import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflows: vi.fn(),
  subscribeToAllWorkflows: vi.fn(() => ({})),
  removeChannel: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: mocks.fetchWorkflows,
  subscribeToAllWorkflows: mocks.subscribeToAllWorkflows,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowLibrary from './WorkflowLibrary'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows']}>
      <Routes>
        <Route path="/workflows" element={<WorkflowLibrary />} />
        <Route path="/workflows/build" element={<div>Workflow builder</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('WorkflowLibrary async and empty actions', () => {
  it('ignores a fetch that resolves after the library unmounts', async () => {
    let resolveFetch
    mocks.fetchWorkflows.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      })
    )
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { unmount } = renderPage()
    expect(screen.getByText(/Loading workflows/)).toBeInTheDocument()

    unmount()
    await act(async () => {
      resolveFetch({ data: [{ id: 'late', title: 'Late workflow' }] })
      await Promise.resolve()
    })

    expect(consoleError).not.toHaveBeenCalled()
  })

  it('opens the builder from the first-workflow empty state', async () => {
    mocks.fetchWorkflows.mockResolvedValue({ data: [] })
    renderPage()
    await screen.findByRole('heading', { name: 'No workflows yet' })

    const build = screen.getByRole('button', { name: 'Build a workflow' })
    build.click()

    expect(await screen.findByText('Workflow builder')).toBeInTheDocument()
  })
})
