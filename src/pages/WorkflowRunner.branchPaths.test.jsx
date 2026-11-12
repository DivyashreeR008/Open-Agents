import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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
  {
    id: 'writer',
    name: 'Writer',
    category: 'Writing',
    provider: 'any',
    systemPrompt: 'Write.',
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
  id: 'w-branch-paths',
  title: 'Branch paths',
  agents: [
    'classify',
    {
      type: 'conditional_branch',
      id: 'route',
      condition: '{{ steps.classify.output }}',
      branches: {
        technical: ['writer'],
        default: [],
      },
    },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.runAgent.mockReset()
  mocks.runAgent.mockResolvedValue({ content: 'technical', duration: 1 })
})

describe('WorkflowRunner conditional branch paths', () => {
  it('shows every labeled edge and marks empty branches', async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/workflows/w-branch-paths/run', state: { workflow } }]}
      >
        <Routes>
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))

    expect(await screen.findByText('Branch Paths (Labeled Edges):')).toBeInTheDocument()
    expect(screen.getAllByText('technical').length).toBeGreaterThan(0)
    expect(screen.getAllByText('writer').length).toBeGreaterThan(0)
    expect(screen.getByText('Default')).toBeInTheDocument()
    expect(screen.getByText('No agents')).toBeInTheDocument()
  })
})
