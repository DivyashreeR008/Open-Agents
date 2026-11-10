import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  loading: true,
  draft: { id: 'd1', name: 'Draft Agent', description: '', pendingCredentialFields: [] },
  draftAgent: null,
}))

vi.mock('../lib/marketplace', () => ({
  getDraft: () => state.draft,
  buildDraftAgent: () => state.draftAgent,
  getMissingDraftFields: () => [],
  removeDraft: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: state.loading }),
}))

vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => <div>runner:{agent.name}</div>,
}))

import MarketplaceDraftPage from './MarketplaceDraftPage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/marketplace/drafts/d1']}>
      <Routes>
        <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('MarketplaceDraftPage draft loading states', () => {
  it('waits for the catalogue instead of declaring the draft unusable', () => {
    state.loading = true
    state.draftAgent = null
    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Draft Agent' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: 'This draft cannot run' })
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/no longer in the catalogue/)).not.toBeInTheDocument()
    expect(screen.queryByText(/runner:/)).not.toBeInTheDocument()
  })

  it('renders the runner once the catalogue has loaded', () => {
    state.loading = false
    state.draftAgent = { id: 'd1', name: 'Draft Agent' }
    renderPage()

    expect(screen.getByText('runner:Draft Agent')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: 'This draft cannot run' })
    ).not.toBeInTheDocument()
  })
})
