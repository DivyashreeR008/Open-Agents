import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ fetchWorkflows: vi.fn(), subscribeToAllWorkflows: vi.fn(() => ({})) }))
const agents = [
  { id: 'a1', name: 'Researcher', category: 'Frontend' },
  { id: 'a2', name: 'Writer', category: 'Writing' },
]

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: mocks.fetchWorkflows,
  subscribeToAllWorkflows: mocks.subscribeToAllWorkflows,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: vi.fn() } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowLibrary from './WorkflowLibrary'

const workflows = [
  { id: 'w1', title: 'Launch plan', description: 'Ship faster', agents: ['a1'], usage_count: 2 },
  { id: 'w2', title: 'Editorial pass', description: 'Polish copy', agents: ['a2'], usage_count: 1 },
  { id: 'w3', title: 'Unknown chain', description: 'Fallback', agents: ['gone'], usage_count: 0 },
]

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows']}>
      <Routes><Route path="/workflows" element={<WorkflowLibrary />} /></Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchWorkflows.mockResolvedValue({ data: workflows })
})

async function search(value) {
  const input = screen.getByLabelText('Search workflows')
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

describe('WorkflowLibrary search and pills', () => {
  it('renders known and unknown agent pills with pluralized counts', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    expect(screen.getByText('Researcher')).toBeInTheDocument()
    expect(screen.getByText('Writer')).toBeInTheDocument()
    expect(screen.getByText('gone')).toBeInTheDocument()
    expect(screen.getAllByText('1 agent').length).toBe(3)
  })

  it('matches title, description, and agent category queries', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    await search('launch')
    expect(screen.getByRole('heading', { name: 'Launch plan' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Editorial pass' })).not.toBeInTheDocument()

    await search('polish')
    expect(screen.getByRole('heading', { name: 'Editorial pass' })).toBeInTheDocument()

    await search('frontend')
    expect(screen.getByRole('heading', { name: 'Launch plan' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Editorial pass' })).not.toBeInTheDocument()
  })

  it('renders the no-match state for an unknown query', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    await search('absent')
    expect(screen.getByRole('heading', { name: 'No workflows found' })).toBeInTheDocument()
  })
})
