import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import MarketplacePage from './MarketplacePage'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      {
        id: 'a1',
        name: 'Summarizer',
        description: 'Summarizes text',
        category: 'Research',
        provider: 'openai',
        systemPrompt: 'Summarize.',
        outputType: 'text',
      },
      {
        id: 'a2',
        name: 'Translator',
        description: 'Translates text',
        category: 'Content Writing',
        provider: 'openai',
        systemPrompt: 'Translate.',
      },
    ],
    loading: false,
    error: null,
  }),
}))

const LISTINGS_KEY = 'oa_marketplace_listings'

const seedListing = (overrides = {}) => ({
  id: 'mkt_edge',
  name: 'Edge Agent',
  description: 'An edge-case listing',
  tags: ['edge'],
  category: 'Research',
  readme: '',
  author: 'Tester',
  config: { provider: 'openai' },
  sanitizedFields: [],
  importCount: 0,
  ratingTotal: 0,
  ratingCount: 0,
  publishedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

const headingNames = () =>
  screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('MarketplacePage filter and picker edges', () => {
  it('shows a filter-specific empty state and restores listings when filters clear', async () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        seedListing({ id: 'mkt_alpha', name: 'Alpha', category: 'Research' }),
        seedListing({ id: 'mkt_beta', name: 'Beta', category: 'Data Science' }),
      ])
    )
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByText('2 of 2 listings')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search marketplace'), 'zzz')

    expect(screen.getByText('No agents match your filters.')).toBeInTheDocument()
    expect(screen.getByText('Try a different search term or category.')).toBeInTheDocument()
    expect(screen.getByText('0 of 2 listings')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search marketplace'))
    expect(headingNames()).toEqual(['Alpha', 'Beta'])

    await user.selectOptions(screen.getByLabelText('Filter by category'), 'Data Science')
    expect(headingNames()).toEqual(['Beta'])
    expect(screen.getByText('1 of 2 listings')).toBeInTheDocument()
  })

  it('labels unreadable or missing publication dates without inventing tags', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        seedListing({ id: 'mkt_blank', name: 'Blank Date', publishedAt: '', tags: [] }),
        seedListing({ id: 'mkt_bad', name: 'Bad Date', publishedAt: 'not-a-date', tags: [] }),
      ])
    )

    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getAllByText('Published date unknown')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Blank Date' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bad Date' })).toBeInTheDocument()
    expect(screen.queryByText('edge')).not.toBeInTheDocument()
  })

  it('keeps a selected agent available when the picker search hides it', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }))
    const dialog = screen.getByRole('dialog', { name: /publish agent to marketplace/i })
    const picker = within(dialog).getByLabelText('Agent to publish')

    await user.selectOptions(picker, 'a1')
    await user.type(within(dialog).getByLabelText('Filter agents to publish'), 'translator')

    expect(picker).toHaveValue('a1')
    expect(within(picker).getByRole('option', { name: 'Summarizer' })).toBeInTheDocument()
    expect(within(picker).getByRole('option', { name: 'Translator' })).toBeInTheDocument()

    await user.clear(within(dialog).getByLabelText('Filter agents to publish'))
    await user.type(within(dialog).getByLabelText('Filter agents to publish'), 'zzz')

    expect(within(dialog).getByText('No matching agents')).toBeInTheDocument()
    expect(within(picker).getByRole('option', { name: 'Summarizer' })).toBeInTheDocument()
  })
})
