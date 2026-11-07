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
    id: 'claude-agent',
    name: 'Claude Agent',
    category: 'Writing',
    provider: 'anthropic',
    systemPrompt: 'Write with Claude.',
    outputType: 'text',
    model: 'claude-3-5-sonnet',
  },
  {
    id: 'gemini-agent',
    name: 'Gemini Agent',
    category: 'Research',
    provider: 'gemini',
    systemPrompt: 'Research with Gemini.',
    outputType: 'text',
    model: 'gemini-1.5-pro',
  },
]

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../lib/useApiKey', () => ({
  useApiKey: () => ({
    provider: 'openai',
    setProvider: vi.fn(),
    apiKey: 'sk-openai-current',
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

function renderWorkflow(agentId) {
  const workflow = {
    id: 'w-provider',
    title: 'Fixed provider workflow',
    agents: [agentId],
  }
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/workflows/w-provider/run', state: { workflow } }]}>
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

describe('WorkflowRunner provider keys', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.runAgent.mockReset()
    mocks.incrementUsage.mockResolvedValue(undefined)
    sessionStorage.clear()
    localStorage.clear()
  })

  it('unwraps a session key saved while another provider was selected', async () => {
    sessionStorage.setItem(
      'oa_apikey_anthropic',
      JSON.stringify({ key: 'sk-anthropic-session', expiresAt: Date.now() + 60_000 })
    )
    mocks.runAgent.mockResolvedValue({ content: 'Claude output', duration: 1 })
    renderWorkflow('claude-agent')
    await startRun()

    expect(await screen.findByText('Claude output')).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'anthropic',
        apiKey: 'sk-anthropic-session',
      })
    )
  })

  it('falls back to a globally saved key for a fixed provider', async () => {
    sessionStorage.setItem(
      'OpenAgents_gemini_key',
      JSON.stringify({ key: 'sk-gemini-global', expiresAt: Date.now() + 60_000 })
    )
    mocks.runAgent.mockResolvedValue({ content: 'Gemini output', duration: 1 })
    renderWorkflow('gemini-agent')
    await startRun()

    expect(await screen.findByText('Gemini output')).toBeInTheDocument()
    expect(mocks.runAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'gemini',
        apiKey: 'sk-gemini-global',
      })
    )
  })

  it('purges an expired session key instead of sending it to the provider', async () => {
    sessionStorage.setItem(
      'oa_apikey_anthropic',
      JSON.stringify({ key: 'sk-expired', expiresAt: Date.now() - 60_000 })
    )
    renderWorkflow('claude-agent')
    await startRun()

    expect(
      await screen.findByText('API key for provider "anthropic" is not configured.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('oa_apikey_anthropic')).toBeNull()
  })
})
