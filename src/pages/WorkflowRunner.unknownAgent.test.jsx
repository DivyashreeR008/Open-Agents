import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  runAgent: vi.fn(),
  recordAnalyticsRun: vi.fn(),
  incrementUsage: vi.fn(),
  exportWorkflowAsMarkdown: vi.fn(),
}))

const agents = [
  {
    id: 'available-agent',
    name: 'Available Agent',
    category: 'Test',
    provider: 'any',
    systemPrompt: 'Work.',
    outputType: 'text',
  },
]

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
  fetchWorkflowById: vi.fn(),
  incrementUsage: mocks.incrementUsage,
}))
vi.mock('../lib/exportMarkdown', () => ({
  exportWorkflowAsMarkdown: mocks.exportWorkflowAsMarkdown,
}))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/OutputRenderer', () => ({
  default: ({ content }) => <div>{content}</div>,
}))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

const workflow = {
  id: 'w-ghost',
  title: 'Deleted agent chain',
  agents: ['available-agent', 'ghost-agent', 'available-agent'],
}

describe('WorkflowRunner missing registry agent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.runAgent.mockReset()
    mocks.incrementUsage.mockResolvedValue(undefined)
  })

  it('stops at the deleted agent and offers a retry from the start', async () => {
    mocks.runAgent.mockResolvedValue({ content: 'first output', duration: 1 })
    render(
      <MemoryRouter initialEntries={[{ pathname: '/workflows/w-ghost/run', state: { workflow } }]}>
        <Routes>
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))

    expect(
      await screen.findByText('Agent "ghost-agent" not found in registry.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledTimes(1)
    expect(mocks.incrementUsage).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Retry from start/ })).toBeInTheDocument()
    expect(screen.queryByText(/Workflow complete/)).toBeNull()
  })
})
