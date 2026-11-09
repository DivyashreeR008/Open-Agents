import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  subscribeToWorkflow: vi.fn(),
  removeChannel: vi.fn(),
}))

vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: mocks.fetchWorkflowById,
  subscribeToWorkflow: mocks.subscribeToWorkflow,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowDetail from './WorkflowDetail'

afterEach(() => vi.restoreAllMocks())

describe('WorkflowDetail late fetch resolution', () => {
  it('ignores a fetch that resolves after the detail view unmounts', async () => {
    let resolveFetch
    mocks.fetchWorkflowById.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      })
    )
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { unmount } = render(
      <MemoryRouter initialEntries={['/workflows/w1']}>
        <Routes>
          <Route path="/workflows/:id" element={<WorkflowDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Loading workflow...')).toBeInTheDocument()
    unmount()

    await act(async () => {
      resolveFetch({ data: { id: 'w1', title: 'Late flow', agents: [] } })
    })

    expect(consoleError).not.toHaveBeenCalled()
  })
})
