import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const drafts = vi.hoisted(() => [
  {
    id: 'd1',
    name: 'Ready Draft',
    description: '',
    pendingCredentialFields: [],
  },
])

vi.mock('../lib/marketplace', () => ({
  loadDrafts: () => drafts,
  removeDraft: vi.fn(),
}))

import MarketplaceDraftsPage from './MarketplaceDraftsPage'

describe('MarketplaceDraftsPage ready draft', () => {
  it('labels a complete draft as ready and shows the no-description fallback', () => {
    render(
      <MemoryRouter>
        <MarketplaceDraftsPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Ready Draft' })).toBeInTheDocument()
    expect(screen.getByText('Ready to run')).toBeInTheDocument()
    expect(screen.getByText('No description.')).toBeInTheDocument()
  })
})
