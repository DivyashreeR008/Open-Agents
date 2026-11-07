import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const agents = [
  {
    id: 'a1',
    name: 'Writer',
    category: 'Writing',
    provider: 'any',
    systemPrompt: 'Write.',
    outputType: 'text',
  },
]

const mocks = vi.hoisted(() => ({
  runAgent: vi.fn(),
  recordAnalyticsRun: vi.fn(),
  incrementUsage: vi.fn(),
  exportWorkflowAsMarkdown: vi.fn(),
}))

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents }),
}))
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
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('WorkflowRunner whitespace input gate', () => {
  it('keeps the run action disabled when the only input is whitespace', () => {
    const workflow = { id: 'w1', title: 'Whitespace chain', agents: ['a1'] }
    render(
      <MemoryRouter initialEntries={[{ pathname: '/workflows/w1/run', state: { workflow } }]}>
        <Routes>
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Paste your main input here/)
    const run = screen.getByRole('button', { name: /Run Workflow/ })
    expect(run).toBeDisabled()

    fireEvent.change(input, { target: { value: '   \n\t' } })
    expect(run).toBeDisabled()
    expect(mocks.runAgent).not.toHaveBeenCalled()
  })
})
