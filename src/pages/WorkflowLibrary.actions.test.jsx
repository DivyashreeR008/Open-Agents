import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ fetchWorkflows: vi.fn(), subscribeToAllWorkflows: vi.fn(), removeChannel: vi.fn() }))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: mocks.fetchWorkflows,
  subscribeToAllWorkflows: mocks.subscribeToAllWorkflows,
}))
vi.mock('../lib/supabase', () => ({ supabase: { removeChannel: mocks.removeChannel } }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import WorkflowLibrary from './WorkflowLibrary'

const workflow = { id: 'w1', title: 'Launch plan', description: 'Ship', agents: [], usage_count: 2 }

function Destination({ label }) {
  const location = useLocation()
  return <div>{label}: {location.pathname} / {location.state?.workflow?.title ?? location.state?.forkedWorkflow?.title}</div>
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/workflows']}>
      <Routes>
        <Route path="/workflows" element={<WorkflowLibrary />} />
        <Route path="/workflows/build" element={<Destination label="Builder" />} />
        <Route path="/workflows/:id/run" element={<Destination label="Runner" />} />
        <Route path="/workflows/:id" element={<Destination label="Detail" />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchWorkflows.mockResolvedValue({ data: [workflow] })
})

describe('WorkflowLibrary actions', () => {
  it('opens the runner with the selected workflow', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    fireEvent.click(screen.getByRole('button', { name: 'Run' }))
    expect(screen.getByText(/Runner: \/workflows\/w1\/run/)).toBeInTheDocument()
  })

  it('opens the detail and builder destinations', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    fireEvent.click(screen.getByRole('button', { name: 'Details' }))
    expect(screen.getByText(/Detail: \/workflows\/w1/)).toBeInTheDocument()
  })

  it('forks into the builder with the source workflow', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    fireEvent.click(screen.getByRole('button', { name: 'Fork' }))
    expect(screen.getByText(/Builder: \/workflows\/build/)).toBeInTheDocument()
  })

  it('applies realtime counts and removes the channel on unmount', async () => {
    let callback
    mocks.subscribeToAllWorkflows.mockImplementation((next) => {
      callback = next
      return { id: 'channel' }
    })
    const { unmount } = renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    expect(screen.getByText('2')).toBeInTheDocument()
    act(() => callback({ new: { id: 'w1', usage_count: 8 } }))
    expect(screen.getByText('8')).toBeInTheDocument()
    unmount()
    expect(mocks.removeChannel).toHaveBeenCalledWith({ id: 'channel' })
  })

  it('opens the builder from the header action', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Launch plan' })
    fireEvent.click(screen.getByRole('button', { name: 'Build workflow' }))
    expect(screen.getByText(/Builder: \/workflows\/build/)).toBeInTheDocument()
  })
})
