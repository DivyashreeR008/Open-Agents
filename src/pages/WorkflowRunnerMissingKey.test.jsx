import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const agents = [
  {
    id: 'first-agent',
    name: 'First Agent',
    category: 'Test',
    provider: 'openai',
    outputType: 'text',
    systemPrompt: 'First.',
  },
  {
    id: 'second-agent',
    name: 'Second Agent',
    category: 'Test',
    provider: 'anthropic',
    outputType: 'text',
    systemPrompt: 'Second.',
  },
]

const mocks = vi.hoisted(() => ({ runAgent: vi.fn() }))

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents, loading: false }) }))
vi.mock('../lib/useApiKey', () => ({
  useApiKey: () => ({
    provider: 'openai',
    setProvider: vi.fn(),
    apiKey: 'sk-openai-key',
    setApiKey: vi.fn(),
    saveForSession: false,
    setSaveForSession: vi.fn(),
  }),
}))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: vi.fn(),
  incrementUsage: vi.fn(),
}))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

function setup() {
  const workflow = { id: 'wf-1', title: 'Two provider chain', agents: ['first-agent', 'second-agent'] }
  render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/wf-1/run', state: { workflow } }]}>
      <WorkflowRunner />
    </MemoryRouter>
  )
}

describe('WorkflowRunner missing provider key', () => {
  beforeEach(() => {
    sessionStorage.clear()
    mocks.runAgent.mockReset()
    mocks.runAgent.mockResolvedValue({ content: 'step one output', duration: 1 })
  })

  it('marks the step failed and shows Retry instead of hanging on Running', async () => {
    setup()
    fireEvent.change(screen.getByPlaceholderText(/Paste your main input/i), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/i }))

    expect(
      await screen.findByText('API key for provider "anthropic" is not configured.')
    ).toBeInTheDocument()

    // only the first (openai) step actually called the model
    expect(mocks.runAgent).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /^Retry$/ })).toBeInTheDocument()
    )
  })
})
