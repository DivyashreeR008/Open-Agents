import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const drafts = vi.hoisted(() => [
  { id: 'd1', name: 'First Draft', description: 'One', pendingCredentialFields: [] },
  { id: 'd2', name: 'Second Draft', description: 'Two', pendingCredentialFields: [] },
])

vi.mock('../lib/marketplace', () => ({
  loadDrafts: () => drafts,
  removeDraft: vi.fn(),
}))

import MarketplaceDraftsPage from './MarketplaceDraftsPage'

describe('MarketplaceDraftsPage header count', () => {
  it('shows the number of imported drafts in the page header', () => {
    render(
      <MemoryRouter>
        <MarketplaceDraftsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Agents you imported from the marketplace')).toBeInTheDocument()
    expect(screen.queryByText('No imported drafts')).not.toBeInTheDocument()
  })
})
