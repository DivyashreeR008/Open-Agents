import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ runAgent: vi.fn() }))

const agents = [
  {
    id: 'claude-agent',
    name: 'Claude Agent',
    category: 'Writing',
    provider: 'anthropic',
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
    apiKey: 'sk-openai-current',
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

beforeEach(() => {
  vi.clearAllMocks()
  sessionStorage.clear()
  localStorage.clear()
  mocks.runAgent.mockReset()
})

describe('WorkflowRunner session key shape', () => {
  it('treats a saved record without a key as missing', async () => {
    sessionStorage.setItem(
      'oa_apikey_anthropic',
      JSON.stringify({ expiresAt: Date.now() + 60_000 })
    )

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/workflows/w-key/run',
            state: {
              workflow: { id: 'w-key', title: 'Key shape', agents: ['claude-agent'] },
            },
          },
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
      await screen.findByText('API key for provider "anthropic" is not configured.')
    ).toBeInTheDocument()
    expect(mocks.runAgent).not.toHaveBeenCalled()
  })
})
