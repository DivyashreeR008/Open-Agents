import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ runAgent: vi.fn() }))

const agents = [
  {
    id: 'classify',
    name: 'Classifier',
    category: 'Data Science',
    provider: 'any',
    systemPrompt: 'Classify.',
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
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflowById: vi.fn(),
  incrementUsage: vi.fn(),
}))
vi.mock('../lib/exportMarkdown', () => ({ exportWorkflowAsMarkdown: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

const workflow = {
  id: 'w-missing-branch-agent',
  title: 'Missing branch agent',
  agents: [
    'classify',
    {
      type: 'conditional_branch',
      id: 'route',
      condition: '{{ steps.classify.output }}',
      branches: { technical: ['missing-agent'] },
    },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.runAgent.mockResolvedValue({ content: 'technical', duration: 1 })
})

describe('WorkflowRunner branch target fallback', () => {
  it('uses the branch agent id when the target is absent from the registry', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/workflows/w-missing-branch-agent/run', state: { workflow } },
        ]}
      >
        <Routes>
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))

    expect(
      await screen.findByText('Agent "missing-agent" not found in registry.')
    ).toBeInTheDocument()
    await waitFor(() => expect(screen.getAllByText('missing-agent').length).toBeGreaterThan(0))
  })
})
