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

function renderPage(workflow) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/w-fail/run', state: { workflow } }]}>
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

describe('WorkflowRunner conditional failures', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.runAgent.mockReset()
    mocks.incrementUsage.mockResolvedValue(undefined)
  })

  it('fails with the missing-default warning when no branch matches', async () => {
    mocks.runAgent.mockResolvedValue({ content: 'unmatched-value', duration: 1 })
    renderPage({
      id: 'w-fail',
      title: 'No default',
      agents: [
        'classify',
        {
          type: 'conditional_branch',
          id: 'route',
          condition: '{{ steps.classify.output }}',
          branches: { billing: ['writer'] },
        },
      ],
    })
    await startRun()

    expect(
      await screen.findByText(
        'Conditional step has no "default" branch; runs with an unmatched condition will fail.'
      )
    ).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: /Retry from start/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
    expect(screen.queryByText(/Workflow complete/)).toBeNull()
  })

  it('reports the first definition problem when the step cannot resolve a branch', async () => {
    renderPage({
      id: 'w-fail',
      title: 'Malformed conditional',
      agents: [
        {
          type: 'conditional_branch',
          condition: '',
          branches: {},
        },
      ],
    })
    await startRun()

    expect(await screen.findByText('Conditional step is missing an "id".')).toBeInTheDocument()
    expect(mocks.runAgent).not.toHaveBeenCalled()
    expect(screen.queryByText(/Workflow complete/)).toBeNull()
  })
})
