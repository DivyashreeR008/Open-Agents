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
    id: 'classify',
    name: 'Classifier',
    category: 'Data Science',
    provider: 'any',
    systemPrompt: 'Classify.',
    outputType: 'text',
  },
  {
    id: 'writer',
    name: 'Writer',
    category: 'Writing',
    provider: 'any',
    systemPrompt: 'Write.',
    outputType: 'text',
  },
  {
    id: 'fallback',
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
  {
    id: 'skip',
    name: 'Skip Writer',
    category: 'Marketing',
    provider: 'any',
    systemPrompt: 'Skip.',
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
  id: 'w-branch-context',
  title: 'Branch context workflow',
  agents: [
    'classify',
    {
      type: 'conditional_branch',
      id: 'route',
      condition: '{{ steps.classify.output }}',
      branches: {
        technical: ['writer'],
        default: ['fallback'],
      },
    },
    {
      type: 'conditional_branch',
      id: 'follow',
      condition: '{{ steps.route.branch }}',
      branches: {
        technical: ['publisher'],
        default: ['skip'],
      },
    },
  ],
}

describe('WorkflowRunner branch context', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.runAgent.mockReset()
    mocks.incrementUsage.mockResolvedValue(undefined)
  })

  it('exposes the selected branch label to the next conditional step', async () => {
    mocks.runAgent
      .mockResolvedValueOnce({ content: 'technical', duration: 1 })
      .mockResolvedValueOnce({ content: 'Draft ready', duration: 2 })
      .mockResolvedValueOnce({ content: 'Published', duration: 3 })
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/workflows/w-branch-context/run', state: { workflow } }]}
      >
        <Routes>
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))

    expect(
      await screen.findByText('Workflow complete! All 5 steps finished successfully.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledTimes(3)
    expect(mocks.runAgent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ systemPrompt: 'Publish.', userMessage: 'Draft ready' })
    )
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.queryByText('Skip Writer: Published')).toBeNull()
    expect(screen.getAllByText('technical').length).toBeGreaterThanOrEqual(2)
  })
})
