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
  default: ({ content }) => <div>{content}</div>,
}))
vi.mock('../components/RunRating', () => ({ default: () => null }))

import WorkflowRunner from './WorkflowRunner'

const workflow = { id: 'w-copy', title: 'Copy fallback', agents: ['a1', 'a2'] }

describe('WorkflowRunner copy fallback', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    mocks.runAgent.mockReset()
    mocks.runAgent
      .mockResolvedValueOnce({ content: 'First output', duration: 12 })
      .mockResolvedValueOnce({ content: 'Second output', duration: 18 })
    mocks.incrementUsage.mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard denied')) },
    })
  })

  it('falls back to a temporary textarea when the Clipboard API is denied', async () => {
    const createdTextareas = []
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tagName, ...rest) => {
      const element = originalCreateElement(tagName, ...rest)
      if (tagName === 'textarea') createdTextareas.push(element)
      return element
    })
    document.execCommand = vi.fn(() => true)

    render(
      <MemoryRouter initialEntries={[{ pathname: '/workflows/w-copy/run', state: { workflow } }]}>
        <Routes>
          <Route path="/workflows/:id/run" element={<WorkflowRunner />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Your Input/), { target: { value: 'Start' } })
    fireEvent.click(screen.getByRole('button', { name: /Run Workflow/ }))
    await screen.findByText('Workflow complete! All 2 steps finished successfully.')

    fireEvent.click(screen.getByRole('button', { name: 'Copy All Outputs' }))

    expect(await screen.findByRole('button', { name: 'Copied!' })).toBeInTheDocument()
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    const copiedTextarea = createdTextareas.find((element) =>
      element.value.includes('=== Researcher ===')
    )
    expect(copiedTextarea).toBeDefined()
    expect(copiedTextarea.value).toBe(
      '=== Researcher ===\n\nFirst output\n\n---\n\n=== Writer ===\n\nSecond output'
    )
    expect(document.body.contains(copiedTextarea)).toBe(false)
  })
})
