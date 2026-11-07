import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  moveAgentToCollection: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [{ id: 'agent-1', name: 'Alpha', description: 'First', category: 'Writing' }],
  }),
}))

vi.mock('../lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all-agents',
  useCollections: () => ({
    collections: [
      { id: 'all-agents', name: 'All Agents', agentIds: ['agent-1'] },
      { id: 'custom-picks', name: 'Custom Picks', agentIds: ['agent-1'] },
    ],
    moveAgentToCollection: state.moveAgentToCollection,
  }),
}))

import Sidebar from './Sidebar'

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={['/agents?collection=custom-picks']}>
      <Sidebar open onClose={() => {}} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  state.moveAgentToCollection.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Sidebar collection drops', () => {
  it('reports a successful move and clears the feedback after the timeout', () => {
    vi.useFakeTimers()
    state.moveAgentToCollection.mockReturnValue({ ok: true })
    renderSidebar()

    const target = screen.getByRole('link', { name: /Custom Picks/ })
    fireEvent.drop(target, { dataTransfer: { getData: () => 'agent-1' } })

    expect(state.moveAgentToCollection).toHaveBeenCalledWith('agent-1', 'custom-picks')
    expect(screen.getByText('Moved to Custom Picks.')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(2200))
    expect(screen.queryByText('Moved to Custom Picks.')).not.toBeInTheDocument()
  })

  it('shows the mutation error and ignores drops without an agent id', () => {
    state.moveAgentToCollection.mockReturnValue({ ok: false, error: 'Collection is full' })
    renderSidebar()

    const target = screen.getByRole('link', { name: /Custom Picks/ })
    fireEvent.drop(target, { dataTransfer: { getData: () => '' } })
    expect(state.moveAgentToCollection).not.toHaveBeenCalled()

    fireEvent.drop(target, { dataTransfer: { getData: () => 'agent-1' } })
    expect(screen.getByText('Collection is full')).toBeInTheDocument()
  })
})
