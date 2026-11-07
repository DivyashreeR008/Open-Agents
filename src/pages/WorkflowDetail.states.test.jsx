import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  subscribeToWorkflow: vi.fn(() => ({ unsubscribe: vi.fn() })),
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

function renderPage(id = 'w1') {
  return render(
    <MemoryRouter initialEntries={[`/workflows/${id}`]}>
      <Routes>
        <Route path="/workflows" element={<div>Workflow library</div>} />
        <Route path="/workflows/:id" element={<WorkflowDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

afterEach(() => vi.restoreAllMocks())

describe('WorkflowDetail states and sharing', () => {
  it('renders the loading state before the fetch settles', () => {
    mocks.fetchWorkflowById.mockReturnValue(new Promise(() => {}))
    renderPage()
    expect(screen.getByText('Loading workflow...')).toBeInTheDocument()
  })

  it('renders the not-found state and returns to the library', async () => {
    mocks.fetchWorkflowById.mockResolvedValue({ error: new Error('missing') })
    renderPage()
    expect(await screen.findByText('Workflow not found.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Back to Library/ }))
    expect(screen.getByText('Workflow library')).toBeInTheDocument()
  })

  it('renders the title and description from the fetched workflow', async () => {
    mocks.fetchWorkflowById.mockResolvedValue({
      data: {
        id: 'w1',
        title: 'Research chain',
        description: 'Find and summarize sources',
        agents: ['a1'],
        usage_count: 3,
      },
    })
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Research chain' })).toBeInTheDocument()
    expect(screen.getByText('Find and summarize sources')).toBeInTheDocument()
  })

  it('copies the page URL through the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    mocks.fetchWorkflowById.mockResolvedValue({ data: { id: 'w1', title: 'Chain', agents: [] } })
    renderPage()
    await screen.findByRole('heading', { name: 'Chain' })
    fireEvent.click(screen.getByRole('button', { name: /Share/ }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(window.location.href))
    expect(await screen.findByRole('button', { name: /Copied!/ })).toBeInTheDocument()
  })

  it('falls back to a temporary textarea when clipboard access is blocked', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) },
    })
    const execCommand = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', { value: execCommand, configurable: true })
    mocks.fetchWorkflowById.mockResolvedValue({ data: { id: 'w1', title: 'Chain', agents: [] } })
    renderPage()
    await screen.findByRole('heading', { name: 'Chain' })
    fireEvent.click(screen.getByRole('button', { name: /Share/ }))
    await screen.findByRole('button', { name: /Copied!/ })
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
  })
})
