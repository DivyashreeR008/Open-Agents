import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  fetchWorkflowById: vi.fn(),
  incrementUsage: vi.fn(),
  runAgent: vi.fn(),
  recordAnalyticsRun: vi.fn(),
  exportWorkflowAsMarkdown: vi.fn(),
}))

const agents = []

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

beforeEach(() => {
  vi.clearAllMocks()
})

describe('WorkflowRunner back navigation', () => {
  it('returns to the previous page from the header', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/workflows',
          {
            pathname: '/workflows/w1/run',
            state: { workflow: { id: 'w1', title: 'Saved chain', agents: [] } },
          },
        ]}
      >
        <Routes>
          <Route path="/workflows" element={<div>Workflow library</div>} />
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Saved chain' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByText('Workflow library')).toBeInTheDocument()
  })
})
