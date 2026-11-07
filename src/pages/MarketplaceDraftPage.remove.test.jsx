import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  draft: { id: 'd1', name: 'Imported', description: '', pendingCredentialFields: [] },
  draftAgent: { id: 'd1', name: 'Imported' },
  missing: [],
}))

const actions = vi.hoisted(() => ({ removeDraft: vi.fn() }))

vi.mock('../lib/marketplace', () => ({
  getDraft: () => state.draft,
  buildDraftAgent: () => state.draftAgent,
  getMissingDraftFields: () => state.missing,
  removeDraft: actions.removeDraft,
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [], loading: false }) }))
vi.mock('../components/AgentRunner', () => ({ default: () => <div>runner</div> }))

import MarketplaceDraftPage from './MarketplaceDraftPage'

describe('MarketplaceDraftPage removal', () => {
  it('removes the draft and returns to the draft list', () => {
    render(
      <MemoryRouter initialEntries={['/marketplace/drafts/d1']}>
        <Routes>
          <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
          <Route path="/marketplace/drafts" element={<div>draft index</div>} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove draft' }))

    expect(actions.removeDraft).toHaveBeenCalledWith('d1')
    expect(screen.getByText('draft index')).toBeInTheDocument()
  })
})
