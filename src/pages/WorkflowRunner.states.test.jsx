import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agents = []

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  incrementUsage: vi.fn(),
  runAgent: vi.fn(),
  recordAnalyticsRun: vi.fn(),
  exportWorkflowAsMarkdown: vi.fn(),
}))

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../lib/useApiKey', () => ({
  useApiKey: () => ({
    provider: 'openai',
    setProvider: vi.fn(),
    apiKey: 'sk-test',
    setApiKey: vi.fn(),
    saveForSession: false,
    setSaveForSession: vi.fn(),
  }),
}))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: mocks.recordAnalyticsRun }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: mocks.fetchWorkflowById,
  incrementUsage: mocks.incrementUsage,
}))
vi.mock('../lib/exportMarkdown', () => ({
  exportWorkflowAsMarkdown: mocks.exportWorkflowAsMarkdown,
}))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

function renderPage({ id = 'w1', state } = {}) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: `/workflows/${id}/run`, state }]}>
      <Routes>
        <Route path="/workflows" element={<div>Workflow library</div>} />
        <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        <Route path="/workflows/run" element={<WorkflowRunner />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => vi.clearAllMocks())

describe('WorkflowRunner load states', () => {
  it('renders the loading message while the workflow request is pending', async () => {
    let resolveFetch
    mocks.fetchWorkflowById.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      })
    )
    renderPage()
    expect(screen.getByText('Loading workflow...')).toBeInTheDocument()
    await act(async () => {
      resolveFetch({ data: { id: 'w1', title: 'Loaded chain', agents: [] } })
    })
    expect(screen.getByRole('heading', { name: 'Loaded chain' })).toBeInTheDocument()
  })

  it('renders the not-found branch for a preview or missing id', () => {
    renderPage({ id: 'preview' })
    expect(screen.getByText('Workflow not found.')).toBeInTheDocument()
    expect(mocks.fetchWorkflowById).not.toHaveBeenCalled()
  })

  it('renders the not-found branch when the route has no id', () => {
    render(
      <MemoryRouter initialEntries={['/workflows/run']}>
        <Routes>
          <Route path="/workflows/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Workflow not found.')).toBeInTheDocument()
  })

  it('renders the load failure and returns to the library', async () => {
    mocks.fetchWorkflowById.mockResolvedValue({ error: new Error('offline') })
    renderPage()
    expect(await screen.findByText('Could not load workflow.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Back to Library/ }))
    expect(screen.getByText('Workflow library')).toBeInTheDocument()
  })

  it('uses router state without fetching and keeps the initial input', () => {
    renderPage({
      state: {
        workflow: { id: 'w1', title: 'Saved chain', agents: [] },
        initialInput: 'Prepared input',
      },
    })
    expect(screen.getByRole('heading', { name: 'Saved chain' })).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Input/)).toHaveValue('Prepared input')
    expect(mocks.fetchWorkflowById).not.toHaveBeenCalled()
  })
})
