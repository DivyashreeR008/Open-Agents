import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MarketplacePage from './MarketplacePage'

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [], loading: false }) }))

const LISTINGS_KEY = 'oa_marketplace_listings'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(
    LISTINGS_KEY,
    JSON.stringify([
      {
        id: 'mkt_no_count',
        name: 'No Count Agent',
        description: 'Has no rating count field',
        tags: [],
        category: 'Test',
        author: 'Tester',
        ratingTotal: 0,
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
    ])
  )
})

describe('MarketplacePage missing rating count', () => {
  it('treats an absent rating count as zero ratings', () => {
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('radiogroup', { name: /from 0 ratings/i })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: /not rated yet/i })).toBeInTheDocument()
  })
})
