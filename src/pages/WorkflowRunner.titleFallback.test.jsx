import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  runAgent: vi.fn(),
  incrementUsage: vi.fn(),
  exportWorkflowAsMarkdown: vi.fn(),
}))

const agents = [
  {
    id: 'a1',
    name: 'Researcher',
    category: 'Research',
    provider: 'any',
    systemPrompt: 'Find.',
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

beforeEach(() => {
  mocks.runAgent.mockReset()
  mocks.incrementUsage.mockReset()
  mocks.exportWorkflowAsMarkdown.mockReset()
  mocks.runAgent.mockResolvedValue({ content: 'Only output', duration: 5 })
  mocks.incrementUsage.mockResolvedValue(undefined)
})

describe('WorkflowRunner title fallbacks', () => {
  it('uses the default heading and export name when the workflow has no title', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/workflows/w-untitled/run',
            state: { workflow: { id: 'w-untitled', agents: ['a1'] } },
          },
        ]}
      >
        <WorkflowRunner />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Run Workflow' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))
    await screen.findByText('Workflow complete! All 1 steps finished successfully.')

    fireEvent.click(screen.getByRole('button', { name: 'Export as Markdown' }))
    expect(mocks.exportWorkflowAsMarkdown).toHaveBeenCalledWith(
      'workflow',
      expect.arrayContaining([expect.objectContaining({ agentId: 'a1', output: 'Only output' })])
    )
  })
})
