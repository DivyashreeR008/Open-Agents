import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import MarketplacePage from './MarketplacePage'

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [], loading: false }) }))

const LISTINGS_KEY = 'oa_marketplace_listings'
const VOTES_KEY = 'oa_marketplace_votes'

const seedListing = (overrides = {}) => ({
  id: 'mkt_seed',
  name: 'Seed Agent',
  description: 'A seeded listing about accessibility',
  tags: ['seed'],
  category: 'Research',
  readme: '',
  author: 'Tester',
  config: {},
  sanitizedFields: [],
  importCount: 0,
  ratingTotal: 0,
  ratingCount: 0,
  publishedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

const renderPage = () =>
  render(
    <MemoryRouter>
      <MarketplacePage />
    </MemoryRouter>
  )

beforeEach(() => {
  localStorage.clear()
})

describe('MarketplacePage batch 8 accessibility', () => {
  it('searches visible author and description text and describes the search scope', async () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        seedListing({
          id: 'mkt_grace',
          name: 'One',
          author: 'Grace Hopper',
          description: 'Quarterly revenue reports',
        }),
        seedListing({ id: 'mkt_other', name: 'Two', author: 'Other', description: 'Unrelated' }),
      ])
    )
    const user = userEvent.setup()
    renderPage()

    const search = screen.getByRole('searchbox', { name: 'Search marketplace' })
    expect(search).toHaveAttribute('placeholder', 'Search name, author, description, or tag...')
    expect(
      screen.getByText(/Search covers listing names, authors, descriptions, and tags/)
    ).toBeVisible()

    await user.type(search, 'Grace')
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.queryByText('Two')).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'quarterly revenue')
    expect(screen.getByText('One')).toBeInTheDocument()
  })

  it('announces rating confirmations in a status region', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('radio', { name: '4 stars' }))

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Your 4-star rating was saved.')
    expect(screen.getByText('Your vote: 4 stars')).toBeInTheDocument()
  })

  it('uses one tab stop and arrow keys inside the rating radio group', async () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ ratingTotal: 3, ratingCount: 1 })])
    )
    const user = userEvent.setup()
    renderPage()

    const group = screen.getByRole('radiogroup', { name: /Rate Seed Agent/ })
    const radios = within(group).getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('tabindex', '0')
    expect(radios.slice(1).every((radio) => radio.getAttribute('tabindex') === '-1')).toBe(true)

    radios[0].focus()
    await user.keyboard('{ArrowRight}')

    expect(radios[1]).toHaveAttribute('aria-checked', 'true')
    expect(radios[1]).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Your 2-star rating was saved.')
  })

  it('describes a changed vote instead of silently replacing it', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_seed: 2 }))
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('radio', { name: '4 stars' }))

    expect(screen.getByRole('status')).toHaveTextContent('Your rating changed from 2 to 4 stars.')
  })

  it('renders duplicate stored tags only once', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ tags: ['ai', 'AI', 'ai', 'ml'] })])
    )
    renderPage()

    expect(screen.getAllByText('ai')).toHaveLength(1)
    expect(screen.getAllByText('ml')).toHaveLength(1)
  })
})
