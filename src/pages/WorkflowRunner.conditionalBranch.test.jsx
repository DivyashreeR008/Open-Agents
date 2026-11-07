import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  runAgent: vi.fn(),
  recordAnalyticsRun: vi.fn(),
  incrementUsage: vi.fn(),
  exportWorkflowAsMarkdown: vi.fn(),
}))

const agents = [
  {
    id: 'classify',
    name: 'Classifier',
    category: 'Data Science',
    provider: 'any',
    systemPrompt: 'Classify.',
    outputType: 'text',
  },
  {
    id: 'writer',
    name: 'Technical Writer',
    category: 'Writing',
    provider: 'any',
    systemPrompt: 'Technical.',
    outputType: 'text',
  },
  {
    id: 'billing-agent',
    name: 'Billing Writer',
    category: 'Finance',
    provider: 'any',
    systemPrompt: 'Billing.',
    outputType: 'text',
  },
  {
    id: 'fallback-agent',
    name: 'Fallback Writer',
    category: 'Writing',
    provider: 'any',
    systemPrompt: 'Fallback.',
    outputType: 'text',
  },
  {
    id: 'publisher',
    name: 'Publisher',
    category: 'Marketing',
    provider: 'any',
    systemPrompt: 'Publish.',
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
  default: ({ content, agentName }) => (
    <div>
      {agentName}: {content}
    </div>
  ),
}))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

const workflow = {
  id: 'w-branch',
  title: 'Branching workflow',
  agents: [
    'classify',
    {
      type: 'conditional_branch',
      id: 'route',
      condition: '{{ steps.classify.output }}',
      branches: {
        technical: ['writer'],
        billing: ['billing-agent'],
        default: ['fallback-agent'],
      },
    },
    'publisher',
  ],
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/w-branch/run', state: { workflow } }]}>
      <Routes>
        <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
      </Routes>
    </MemoryRouter>
  )
}

async function startRun() {
  fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
  fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))
}

describe('WorkflowRunner conditional branches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.runAgent.mockReset()
    mocks.incrementUsage.mockResolvedValue(undefined)
  })

  it('runs only the matched branch and then continues the chain', async () => {
    mocks.runAgent
      .mockResolvedValueOnce({ content: 'technical', duration: 1 })
      .mockResolvedValueOnce({ content: 'Draft ready', duration: 2 })
      .mockResolvedValueOnce({ content: 'Published', duration: 3 })
    renderPage()
    await startRun()

    expect(
      await screen.findByText('Workflow complete! All 4 steps finished successfully.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledTimes(3)
    expect(mocks.runAgent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ systemPrompt: 'Technical.', userMessage: 'technical' })
    )
    expect(mocks.runAgent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ systemPrompt: 'Publish.', userMessage: 'Draft ready' })
    )
    expect(screen.getByText('Technical Writer: Draft ready')).toBeInTheDocument()
    expect(screen.getByText('Publisher: Published')).toBeInTheDocument()
    expect(screen.queryByText('Billing Writer: Draft ready')).toBeNull()
    expect(screen.queryByText('Fallback Writer: Draft ready')).toBeNull()
    expect(screen.getAllByText('technical').length).toBeGreaterThanOrEqual(1)
  })

  it('uses the default branch when no label matches', async () => {
    mocks.runAgent
      .mockResolvedValueOnce({ content: 'unknown-topic', duration: 1 })
      .mockResolvedValueOnce({ content: 'Fallback draft', duration: 2 })
      .mockResolvedValueOnce({ content: 'Final copy', duration: 3 })
    renderPage()
    await startRun()

    expect(
      await screen.findByText('Workflow complete! All 4 steps finished successfully.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledTimes(3)
    expect(mocks.runAgent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ systemPrompt: 'Fallback.', userMessage: 'unknown-topic' })
    )
    expect(screen.getByText('Fallback Writer: Fallback draft')).toBeInTheDocument()
    expect(screen.queryByText('Technical Writer: Fallback draft')).toBeNull()
    expect(screen.getAllByText('default').length).toBeGreaterThanOrEqual(1)
  })
})
