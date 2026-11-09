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
        id: 'mkt_one_rating',
        name: 'One Rating Agent',
        description: 'Has a single rating',
        tags: ['rated'],
        category: 'Test',
        author: 'Tester',
        ratingTotal: 5,
        ratingCount: 1,
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
    ])
  )
})

describe('MarketplacePage singular rating count', () => {
  it('uses singular wording and the numeric average for one rating', () => {
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('radiogroup', { name: /Average 5\.0 from 1 rating\./i })
    ).toBeInTheDocument()
  })
})
