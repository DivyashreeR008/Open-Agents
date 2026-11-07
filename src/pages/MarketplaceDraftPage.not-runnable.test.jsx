import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  draft: { id: 'd1', name: 'Orphan', description: '', pendingCredentialFields: [] },
  draftAgent: null,
  missing: [],
}))

vi.mock('../lib/marketplace', () => ({
  getDraft: () => state.draft,
  buildDraftAgent: () => state.draftAgent,
  getMissingDraftFields: () => state.missing,
  removeDraft: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [], loading: false }) }))
vi.mock('../components/AgentRunner', () => ({ default: () => <div>runner</div> }))

import MarketplaceDraftPage from './MarketplaceDraftPage'

describe('MarketplaceDraftPage missing source agent', () => {
  it('explains that the draft can no longer run', () => {
    render(
      <MemoryRouter initialEntries={['/marketplace/drafts/d1']}>
        <Routes>
          <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'This draft cannot run' })
    ).toBeInTheDocument()
    expect(screen.getByText(/no longer in the catalogue/)).toBeInTheDocument()
    expect(screen.queryByText('runner')).not.toBeInTheDocument()
  })
})
