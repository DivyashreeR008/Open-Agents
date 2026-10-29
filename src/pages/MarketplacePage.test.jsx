import { describe, it, expect, vi, beforeEach } from 'vitest'
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
      category: 'Content Generation',
      provider: 'openai',
      systemPrompt: 'Translate.',
    },
  ]
  return { useAgents: () => ({ agents, loading: false, error: null }) }
})

const LISTINGS_KEY = 'oa_marketplace_listings'
const DRAFTS_KEY = 'oa_marketplace_drafts'

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

describe('MarketplacePage publishing and import', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the empty state before anything is published', () => {
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    expect(screen.getByText('The marketplace is empty.')).toBeInTheDocument()
  })

  it('opens and closes the publish form', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const dialog = await openPublish(user)
    expect(within(dialog).getByRole('heading', { name: 'Publish to Marketplace' })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps Publish disabled until agent, name and description are filled', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
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
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    const dialog = await openPublish(user)
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(localStorage.getItem(LISTINGS_KEY)).toBeNull()
  })

  it('publishes a listing, confirms it and closes the form', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    const dialog = await openPublish(user)

    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a1')
    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'My Pack')
    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Does things')
    await user.type(within(dialog).getByPlaceholderText('summarizer, research, markdown'), 'alpha, beta,, ')
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
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
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
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)

    expect(screen.getByText('0 imports')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(
      screen.getByText('Imported "Seed Agent (imported)". Complete 1 credential field(s) in My drafts before running it.')
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
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(screen.getByText('Imported "Seed Agent (imported)". Open it from My drafts to run it.')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(DRAFTS_KEY))[0].readyToRun).toBe(true)
  })

  it('shows a published listing again after remounting', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    const dialog = await openPublish(user)
    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a2')
    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'Persisted')
    await user.type(within(dialog).getByPlaceholderText('What does this agent do?'), 'Stays')
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))
    unmount()

    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Persisted' })).toBeInTheDocument()
  })
})
