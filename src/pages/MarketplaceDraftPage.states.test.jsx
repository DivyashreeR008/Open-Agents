import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const state = vi.hoisted(() => ({
  draft: null,
  draftAgent: null,
  missing: [],
}))

const actions = vi.hoisted(() => ({ removeDraft: vi.fn() }))

vi.mock('../lib/marketplace', () => ({
  getDraft: () => state.draft,
  buildDraftAgent: () => state.draftAgent,
  getMissingDraftFields: () => state.missing,
  removeDraft: actions.removeDraft,
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: false }),
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

describe('MarketplaceDraftPage readiness states', () => {
  it('reports a missing draft', () => {
    state.draft = null
    state.draftAgent = null
    state.missing = []
    renderPage()

    expect(screen.getByRole('heading', { level: 3, name: 'Draft not found' })).toBeInTheDocument()
  })

  it('counts the credential fields still blocking the runner', () => {
    state.draft = {
      id: 'd1',
      name: 'Imported agent',
      description: 'A draft',
      pendingCredentialFields: ['apiKey', 'workspaceId'],
    }
    state.draftAgent = { id: 'd1', name: 'Imported agent' }
    state.missing = ['apiKey', 'workspaceId']
    renderPage()

    expect(
      screen.getByText('Complete 2 more fields above to unlock the runner.')
    ).toBeInTheDocument()
    expect(screen.queryByText(/runner:/)).not.toBeInTheDocument()
  })

  it('renders the runner once no fields are missing', () => {
    state.draft = {
      id: 'd1',
      name: 'Ready agent',
      description: '',
      pendingCredentialFields: [],
    }
    state.draftAgent = { id: 'd1', name: 'Ready agent' }
    state.missing = []
    renderPage()

    expect(screen.getByText('runner:Ready agent')).toBeInTheDocument()
  })
})
