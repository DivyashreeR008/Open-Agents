import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/marketplace', () => ({
  loadDrafts: () => [],
  removeDraft: vi.fn(),
}))

import MarketplaceDraftsPage from './MarketplaceDraftsPage'

describe('MarketplaceDraftsPage empty navigation', () => {
  it('offers both a header return and an in-state browse action', () => {
    render(
      <MemoryRouter>
        <MarketplaceDraftsPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Back to marketplace' })).toHaveAttribute(
      'href',
      '/marketplace'
    )
    expect(screen.getByRole('link', { name: 'Browse marketplace' })).toHaveAttribute(
      'href',
      '/marketplace'
    )
  })
})
