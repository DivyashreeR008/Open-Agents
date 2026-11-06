import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  runAgent: vi.fn(),
  incrementUsage: vi.fn(),
  recordAnalyticsRun: vi.fn(),
}))

const agents = [
  { id: 'a1', name: 'Researcher', category: 'Research', provider: 'any', systemPrompt: 'Find.' },
  { id: 'a2', name: 'Writer', category: 'Writing', provider: 'any', systemPrompt: 'Write.' },
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
vi.mock('../lib/exportMarkdown', () => ({ exportWorkflowAsMarkdown: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

const workflow = { id: 'w1', title: 'Research chain', agents: ['a1', 'a2'] }

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/w1/run', state: { workflow } }]}>
      <Routes>
        <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.runAgent.mockReset()
  mocks.incrementUsage.mockResolvedValue(undefined)
})

describe('WorkflowRunner failure recovery', () => {
  it('stops the chain, reports the error, and retries from the start', async () => {
    mocks.runAgent
      .mockRejectedValueOnce(new Error('Provider timeout'))
      .mockResolvedValue({ content: 'Recovered output', duration: 10 })

    renderPage()
    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))

    expect(await screen.findByText('Provider timeout')).toBeInTheDocument()
    expect(screen.getByText('Step failed')).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledTimes(1)
    expect(mocks.incrementUsage).not.toHaveBeenCalled()
    expect(screen.queryByText(/Workflow complete/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Retry from start/ }))
    expect(screen.queryByText('Provider timeout')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Workflow/ })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))
    expect(
      await screen.findByText('Workflow complete! All 2 steps finished successfully.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledTimes(3)
    expect(mocks.runAgent).toHaveBeenLastCalledWith(
      expect.objectContaining({ userMessage: 'Recovered output' })
    )
  })

  it('keeps the primary run control disabled without input', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /Run Workflow/ })).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Ready' } })
    expect(screen.getByRole('button', { name: /Run Workflow/ })).toBeEnabled()
  })
})
