import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({ drafts: [] }))
const actions = vi.hoisted(() => ({ removeDraft: vi.fn() }))

vi.mock('../lib/marketplace', () => ({
  loadDrafts: () => state.drafts,
  removeDraft: actions.removeDraft,
}))

import MarketplaceDraftsPage from './MarketplaceDraftsPage'

describe('MarketplaceDraftsPage list states', () => {
  it('shows the empty state when no marketplace agent was imported', () => {
    state.drafts = []
    render(
      <MemoryRouter>
        <MarketplaceDraftsPage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'No imported drafts' })
    ).toBeInTheDocument()
  })

  it('labels drafts that still need credential fields', () => {
    state.drafts = [
      {
        id: 'd1',
        name: 'Draft one',
        description: '',
        pendingCredentialFields: ['apiKey'],
      },
      { id: 'd2', name: 'Draft two', description: 'Ready', pendingCredentialFields: [] },
    ]
    render(
      <MemoryRouter>
        <MarketplaceDraftsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('1 field(s) to complete')).toBeInTheDocument()
    expect(screen.getByText('Ready to run')).toBeInTheDocument()
    expect(screen.getByText('No description.')).toBeInTheDocument()
  })

  it('removes a draft and reloads the list', () => {
    state.drafts = [{ id: 'd1', name: 'Draft one', description: '', pendingCredentialFields: [] }]
    render(
      <MemoryRouter>
        <MarketplaceDraftsPage />
      </MemoryRouter>
    )

    state.drafts = []
    fireEvent.click(screen.getByRole('button', { name: 'Remove Draft one' }))

    expect(actions.removeDraft).toHaveBeenCalledWith('d1')
    expect(
      screen.getByRole('heading', { level: 3, name: 'No imported drafts' })
    ).toBeInTheDocument()
  })
})
