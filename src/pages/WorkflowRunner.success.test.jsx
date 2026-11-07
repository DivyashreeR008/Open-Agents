import { describe, expect, it, vi, beforeEach } from 'vitest'
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
    id: 'a1',
    name: 'Researcher',
    category: 'Research',
    provider: 'any',
    systemPrompt: 'Find.',
    outputType: 'text',
  },
  {
    id: 'a2',
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
  default: ({ content, agentName }) => (
    <div>
      {agentName}: {content}
    </div>
  ),
}))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

function renderPage(state = {}) {
  const workflow = state.workflow ?? { id: 'w1', title: 'Research chain', agents: ['a1', 'a2'] }
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: '/workflows/w1/run', state: { ...state, workflow } }]}
    >
      <Routes>
        <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.runAgent.mockReset()
  mocks.runAgent
    .mockResolvedValueOnce({ content: 'First output', duration: 12 })
    .mockResolvedValueOnce({ content: 'Second output', duration: 18 })
  mocks.incrementUsage.mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
})

describe('WorkflowRunner successful chain', () => {
  it('chains output, records analytics, and increments usage once', async () => {
    renderPage()
    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: '  Start here  ' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))

    expect(
      await screen.findByText('Workflow complete! All 2 steps finished successfully.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ userMessage: 'Start here' })
    )
    expect(mocks.runAgent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ userMessage: 'First output' })
    )
    expect(screen.getByText('Researcher: First output')).toBeInTheDocument()
    expect(screen.getByText('Writer: Second output')).toBeInTheDocument()
    expect(mocks.recordAnalyticsRun).toHaveBeenCalledTimes(2)
    expect(mocks.recordAnalyticsRun).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ agentId: 'a1', provider: 'openai' })
    )
    expect(mocks.incrementUsage).toHaveBeenCalledTimes(1)
    expect(mocks.incrementUsage).toHaveBeenCalledWith('w1')
  })

  it('copies completed output and exports the workflow', async () => {
    renderPage()
    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))
    await screen.findByText('Workflow complete! All 2 steps finished successfully.')

    fireEvent.click(screen.getByRole('button', { name: 'Copy All Outputs' }))
    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '=== Researcher ===\n\nFirst output\n\n---\n\n=== Writer ===\n\nSecond output'
    )

    fireEvent.click(screen.getByRole('button', { name: 'Export as Markdown' }))
    expect(mocks.exportWorkflowAsMarkdown).toHaveBeenCalledWith(
      'Research chain',
      expect.arrayContaining([
        expect.objectContaining({ agentId: 'a1', output: 'First output' }),
        expect.objectContaining({ agentId: 'a2', output: 'Second output' }),
      ])
    )
  })

  it('skips usage increment for an unsaved draft and rebuilds on Run Again', async () => {
    renderPage({ workflow: { id: null, title: 'Draft chain', agents: ['a1', 'a2'] } })
    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))
    await screen.findByText('Workflow complete! All 2 steps finished successfully.')
    expect(mocks.incrementUsage).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Run Again' }))
    expect(screen.queryByText(/Workflow complete/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Run Workflow/ })).toBeInTheDocument()
  })
})
