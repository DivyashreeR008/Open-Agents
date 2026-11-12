import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const agents = [
  {
    id: 'writer',
    name: 'Writer',
    category: 'Writing',
    provider: 'any',
    systemPrompt: 'Write.',
    outputType: 'text',
  },
]

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../lib/useApiKey', () => ({
  useApiKey: () => ({
    provider: 'mystery',
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
vi.mock('../components/ApiKeyBar', () => ({
  default: ({ model }) => <div data-testid="api-model">{model}</div>,
}))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

const workflow = { id: 'w-unknown-provider', title: 'Unknown provider', agents: ['writer'] }

describe('WorkflowRunner unknown provider model', () => {
  it('passes the default OpenAI model to the key bar for an unknown provider', () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/workflows/w-unknown-provider/run', state: { workflow } }]}
      >
        <Routes>
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('api-model')).toHaveTextContent('gpt-4o')
  })
})
