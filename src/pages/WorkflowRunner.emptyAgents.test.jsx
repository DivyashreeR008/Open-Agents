import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  runAgent: vi.fn(),
  incrementUsage: vi.fn(),
}))

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
const agents = []

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
vi.mock('../lib/exportMarkdown', () => ({ exportWorkflowAsMarkdown: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/OutputRenderer', () => ({ default: () => null }))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

beforeEach(() => {
  mocks.runAgent.mockReset()
  mocks.incrementUsage.mockReset()
  mocks.incrementUsage.mockResolvedValue(undefined)
})

describe('WorkflowRunner without agent steps', () => {
  it('completes a workflow whose agents field is null', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/workflows/w-empty/run',
            state: { workflow: { id: 'w-empty', title: 'Empty chain', agents: null } },
          },
        ]}
      >
        <WorkflowRunner />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))

    await waitFor(() => {
      expect(
        screen.getByText('Workflow complete! All 0 steps finished successfully.')
      ).toBeInTheDocument()
    })
    expect(mocks.runAgent).not.toHaveBeenCalled()
    expect(mocks.incrementUsage).toHaveBeenCalledWith('w-empty')
  })
})
