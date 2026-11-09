import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  draft: { id: 'd1', name: 'Loading draft', description: '', pendingCredentialFields: [] },
}))

vi.mock('../lib/marketplace', () => ({
  getDraft: () => state.draft,
  buildDraftAgent: () => null,
  getMissingDraftFields: () => [],
  removeDraft: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: true }),
}))

vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => <div>runner:{agent.name}</div>,
}))

import MarketplaceDraftPage from './MarketplaceDraftPage'

describe('MarketplaceDraftPage loading state', () => {
  it('waits for the catalogue instead of declaring the draft unusable', () => {
    render(
      <MemoryRouter initialEntries={['/marketplace/drafts/d1']}>
        <Routes>
          <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Loading draft' })).toBeInTheDocument()
    expect(screen.queryByText('This draft cannot run')).not.toBeInTheDocument()
    expect(screen.queryByText(/runner:/)).not.toBeInTheDocument()
  })
})
