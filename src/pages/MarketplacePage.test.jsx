import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import MarketplacePage from './MarketplacePage'

vi.mock('../lib/useAgents', () => {
  const agents = [
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
  ]
  return { useAgents: () => ({ agents, loading: false, error: null }) }
})

const LISTINGS_KEY = 'oa_marketplace_listings'
const DRAFTS_KEY = 'oa_marketplace_drafts'
const VOTES_KEY = 'oa_marketplace_votes'

const seedListing = (overrides = {}) => ({
  id: 'mkt_seed',
  name: 'Seed Agent',
  description: 'A seeded listing',
  tags: ['seed'],
  category: 'Research',
  readme: '',
  author: 'Tester',
  config: { provider: 'openai', apiKey: 'YOUR_APIKEY_HERE' },
  sanitizedFields: ['apiKey'],
  importCount: 0,
  ratingTotal: 0,
  ratingCount: 0,
  publishedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

const openPublish = async (user) => {
  await user.click(screen.getByRole('button', { name: /publish to marketplace/i }))
  return screen.getByRole('dialog', { name: /publish agent to marketplace/i })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MarketplacePage publishing and import', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the empty state before anything is published', () => {
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    expect(screen.getByText('The marketplace is empty.')).toBeInTheDocument()
  })

  it('opens and closes the publish form', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const dialog = await openPublish(user)
    expect(
      within(dialog).getByRole('heading', { name: 'Publish to Marketplace' })
    ).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps Publish disabled until agent, name and description are filled', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    const dialog = await openPublish(user)
    const publish = within(dialog).getByRole('button', { name: 'Publish' })
    expect(publish).toBeDisabled()

    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a1')
    expect(publish).toBeDisabled()

    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'My Pack')
    expect(publish).toBeDisabled()

    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), '   ')
    expect(publish).toBeDisabled()

    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Does things')
    expect(publish).toBeEnabled()
  })

  it('does not publish when required fields are missing', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    const dialog = await openPublish(user)
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(localStorage.getItem(LISTINGS_KEY)).toBeNull()
  })

  it('publishes a listing, confirms it and closes the form', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    const dialog = await openPublish(user)

    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a1')
    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'My Pack')
    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Does things')
    await user.type(
      within(dialog).getByPlaceholderText('summarizer, research, markdown'),
      'alpha, beta,, '
    )
    await user.type(within(dialog).getByPlaceholderText('Your name'), 'Chanchal')
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Published "My Pack" to the marketplace.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'My Pack' })).toBeInTheDocument()
    expect(screen.getByText('by Chanchal')).toBeInTheDocument()
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()

    const stored = JSON.parse(localStorage.getItem(LISTINGS_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({
      name: 'My Pack',
      tags: ['alpha', 'beta'],
      config: { baseAgentId: 'a1', provider: 'openai', systemPrompt: 'Summarize.' },
    })
  })

  it('filters the agent picker by search text', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    const dialog = await openPublish(user)

    const filter = within(dialog).getByLabelText('Filter agents to publish')
    await user.type(filter, 'transl')
    const picker = within(dialog).getByLabelText('Agent to publish')
    expect(within(picker).getByRole('option', { name: 'Translator' })).toBeInTheDocument()
    expect(within(picker).queryByRole('option', { name: 'Summarizer' })).not.toBeInTheDocument()

    await user.clear(filter)
    await user.type(filter, 'zzzz')
    expect(within(dialog).getByText('No matching agents')).toBeInTheDocument()
  })

  it('imports a listing with credential fields and asks for configuration', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByText('0 imports')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(
      screen.getByText(
        'Imported "Seed Agent (imported)". Complete 1 credential field(s) in My drafts before running it.'
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Imported' })).toBeInTheDocument()
    expect(screen.getByText('1 import')).toBeInTheDocument()

    const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY))
    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({
      sourceListingId: 'mkt_seed',
      name: 'Seed Agent (imported)',
      pendingCredentialFields: ['apiKey'],
      readyToRun: false,
    })
  })

  it('imports a listing without credential fields as ready to run', async () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ config: { provider: 'openai' }, sanitizedFields: [] })])
    )
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(
      screen.getByText('Imported "Seed Agent (imported)". Open it from My drafts to run it.')
    ).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(DRAFTS_KEY))[0].readyToRun).toBe(true)
  })

  it('shows a published listing again after remounting', async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    const dialog = await openPublish(user)
    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a2')
    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'Persisted')
    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Stays')
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))
    unmount()

    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Persisted' })).toBeInTheDocument()
  })

  it('keeps the publish form open and reports when storage refuses the write', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    const dialog = await openPublish(user)
    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a1')
    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'Unsaved Pack')
    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Does things')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(/Publishing failed because browser storage is unavailable or full/i)
    ).toBeInTheDocument()
    expect(screen.queryByText(/Published "Unsaved Pack"/)).not.toBeInTheDocument()
    expect(localStorage.getItem(LISTINGS_KEY)).toBeNull()
  })

  it('reports an import that storage refused without changing the listing count', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(
      screen.getByText(/Import could not be saved because browser storage is unavailable or full/i)
    ).toBeInTheDocument()
    expect(screen.getByText('0 imports')).toBeInTheDocument()
    expect(localStorage.getItem(DRAFTS_KEY)).toBeNull()
  })

  it('reports an import whose listing disappeared instead of doing nothing', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    localStorage.setItem(LISTINGS_KEY, JSON.stringify([]))
    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(
      screen.getByText(/Import failed because the listing is no longer available/i)
    ).toBeInTheDocument()
    expect(screen.getByText('The marketplace is empty.')).toBeInTheDocument()
  })

  it('recognizes an imported listing after remounting and does not duplicate the draft', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    const user = userEvent.setup()
    const { unmount } = render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: 'Import' }))
    expect(screen.getByRole('button', { name: 'Imported' })).toBeDisabled()
    unmount()

    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: 'Imported' })).toBeDisabled()
    expect(screen.getByText('1 import')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(DRAFTS_KEY))).toHaveLength(1)
  })

  it('skips a damaged stored record and keeps the valid listings visible', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([null, 'broken', 5, [], seedListing({ name: 'Survivor' }), { name: 'No id' }])
    )

    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Survivor' })).toBeInTheDocument()
    expect(screen.getByText('1 of 1 listing')).toBeInTheDocument()
  })
})

describe('MarketplacePage rating display', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('keeps the aggregate and the viewer vote as separate values', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ ratingTotal: 11, ratingCount: 3 })])
    )
    localStorage.setItem('oa_marketplace_votes', JSON.stringify({ mkt_seed: 2 }))

    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByText('3.7 (3)')).toBeInTheDocument()
    expect(screen.getByText('You: 2')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '2 stars' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radiogroup', { name: /Rate Seed Agent/ })).toHaveAccessibleName(
      /Average 3.7 from 3 ratings/
    )
  })

  it('toggles the same star off and returns the listing to unrated', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('radio', { name: '4 stars' }))
    expect(screen.getByText('4.0 (1)')).toBeInTheDocument()
    expect(screen.getByText('You: 4')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '4 stars' }))
    expect(screen.getByText('No ratings')).toBeInTheDocument()
    expect(screen.queryByText('You: 4')).not.toBeInTheDocument()
  })

  it('retracts a vote through the explicit clear control', async () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ ratingTotal: 2, ratingCount: 1 })])
    )
    localStorage.setItem('oa_marketplace_votes', JSON.stringify({ mkt_seed: 2 }))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: 'Remove your rating for Seed Agent' }))

    expect(screen.getByText('No ratings')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('oa_marketplace_votes'))).toEqual({})
  })

  it('draws fractional fills from the same average as the text', () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ ratingTotal: 22, ratingCount: 5 })])
    )

    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    const group = screen.getByRole('radiogroup', { name: /Rate Seed Agent/ })
    const widths = Array.from(group.querySelectorAll('span[style]')).map((node) => node.style.width)
    expect(widths).toEqual(['100%', '100%', '100%', '100%', '40%'])
    expect(screen.getByText('4.4 (5)')).toBeInTheDocument()
  })

  it('reads stored votes once for the list instead of once per card render', async () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        seedListing({ id: 'mkt_one', name: 'First Agent' }),
        seedListing({ id: 'mkt_two', name: 'Second Agent' }),
        seedListing({ id: 'mkt_three', name: 'Third Agent' }),
      ])
    )
    localStorage.setItem(VOTES_KEY, JSON.stringify({ mkt_one: 4, mkt_two: 2, mkt_three: 5 }))
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByText('You: 4')).toBeInTheDocument()
    expect(screen.getByText('You: 2')).toBeInTheDocument()
    expect(screen.getByText('You: 5')).toBeInTheDocument()

    const voteReads = () => getItem.mock.calls.filter(([key]) => key === VOTES_KEY).length
    const readsAfterMount = voteReads()
    expect(readsAfterMount).toBeGreaterThan(0)

    await user.hover(screen.getAllByRole('radio', { name: '5 stars' })[0])
    await user.type(screen.getByLabelText('Search marketplace'), 'agent')
    await user.selectOptions(screen.getByLabelText('Sort listings'), 'rating')

    expect(voteReads()).toBe(readsAfterMount)
  })

  it('shows a numeric average after re-rating a listing with no stored total', async () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([seedListing({ ratingTotal: undefined, ratingCount: 1 })])
    )
    localStorage.setItem('oa_marketplace_votes', JSON.stringify({ mkt_seed: 5 }))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByText('5.0 (1)')).toBeInTheDocument()
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '3 stars' }))

    expect(screen.getByText('3.0 (1)')).toBeInTheDocument()
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
  })

  it('reports a rating that storage refused instead of showing a false success', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    await user.click(screen.getByRole('radio', { name: '4 stars' }))

    expect(
      screen.getByText(/Rating was not saved because browser storage is unavailable or full/i)
    ).toBeInTheDocument()
    expect(screen.getByText('No ratings')).toBeInTheDocument()
    expect(screen.queryByText('You: 4')).not.toBeInTheDocument()
  })
})

describe('MarketplacePage listing order and dates', () => {
  const seedCatalog = () => {
    localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify([
        seedListing({
          id: 'mkt_alpha',
          name: 'Alpha',
          category: 'Research',
          publishedAt: '2026-03-01T12:00:00.000Z',
          ratingTotal: 4,
          ratingCount: 1,
          importCount: 1,
        }),
        seedListing({
          id: 'mkt_beta',
          name: 'Beta',
          category: 'Content Writing',
          publishedAt: '2026-02-01T12:00:00.000Z',
          ratingTotal: 5,
          ratingCount: 1,
          importCount: 10,
        }),
        seedListing({
          id: 'mkt_gamma',
          name: 'Gamma',
          category: 'Research',
          publishedAt: '2026-01-01T12:00:00.000Z',
          ratingTotal: 0,
          ratingCount: 0,
          importCount: 3,
        }),
      ])
    )
  }

  const cardNames = () =>
    screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)

  beforeEach(() => {
    localStorage.clear()
  })

  it('shows a readable publication date on every card', () => {
    seedCatalog()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Published Mar 1, 2026')).toBeInTheDocument()
    expect(screen.getByText('Published Feb 1, 2026')).toBeInTheDocument()
    expect(screen.getByText('Published Jan 1, 2026')).toBeInTheDocument()
  })

  it('orders by newest, oldest, rating and imports with a labelled active order', async () => {
    seedCatalog()
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    expect(cardNames()).toEqual(['Alpha', 'Beta', 'Gamma'])
    expect(screen.getByText('Sorted by newest first.')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Sort listings'), 'oldest')
    expect(cardNames()).toEqual(['Gamma', 'Beta', 'Alpha'])
    expect(screen.getByText('Sorted by oldest first.')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Sort listings'), 'rating')
    expect(cardNames()).toEqual(['Beta', 'Alpha', 'Gamma'])
    expect(screen.getByText('Sorted by highest rated.')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Sort listings'), 'imports')
    expect(cardNames()).toEqual(['Beta', 'Gamma', 'Alpha'])
    expect(screen.getByText('Sorted by most imported.')).toBeInTheDocument()
  })

  it('keeps sorting active while searching and filtering by category', async () => {
    seedCatalog()
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    await user.selectOptions(screen.getByLabelText('Sort listings'), 'imports')
    await user.type(screen.getByLabelText('Search marketplace'), 'Beta')

    expect(cardNames()).toEqual(['Beta'])
    expect(screen.getByText('Published Feb 1, 2026')).toBeInTheDocument()
    expect(screen.getByText('1 of 3 listings')).toBeInTheDocument()
    expect(screen.getByText('Sorted by most imported.')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search marketplace'))
    await user.selectOptions(screen.getByLabelText('Filter by category'), 'Research')
    await user.selectOptions(screen.getByLabelText('Sort listings'), 'oldest')

    expect(cardNames()).toEqual(['Gamma', 'Alpha'])
    expect(screen.getByText('2 of 3 listings')).toBeInTheDocument()
  })
})
