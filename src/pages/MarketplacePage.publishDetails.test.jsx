import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

const mocks = vi.hoisted(() => ({ importAgent: vi.fn() }))

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
    ],
    loading: false,
    error: null,
  }),
}))
vi.mock('../lib/marketplace', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, importAgent: mocks.importAgent }
})

import MarketplacePage from './MarketplacePage'

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
  config: { provider: 'openai' },
  sanitizedFields: [],
  importCount: 0,
  ratingTotal: 0,
  ratingCount: 0,
  publishedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

function renderPage() {
  return render(
    <MemoryRouter>
      <MarketplacePage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MarketplacePage publish details and import outcomes', () => {
  it('stores the selected category and README text with the listing', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }))
    const dialog = screen.getByRole('dialog', { name: /publish agent to marketplace/i })

    await user.selectOptions(within(dialog).getByLabelText('Agent to publish'), 'a1')
    await user.type(within(dialog).getByPlaceholderText('My Agent Pack'), 'Research Pack')
    await user.type(
      within(dialog).getByPlaceholderText('What does this agent do?'),
      'Finds sources'
    )
    await user.selectOptions(within(dialog).getByLabelText('Category'), 'Content Generation')
    await user.type(within(dialog).getByLabelText('README, optional'), 'Use a short source list.')
    await user.click(within(dialog).getByRole('checkbox', { name: /publish anonymously/i }))
    await user.click(within(dialog).getByRole('button', { name: 'Publish' }))

    const stored = JSON.parse(localStorage.getItem(LISTINGS_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({
      name: 'Research Pack',
      category: 'Content Generation',
      readme: 'Use a short source list.',
    })
  })

  it('explains that a repeated import already exists in drafts', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    mocks.importAgent.mockReturnValue({
      name: 'Seed Agent (imported)',
      alreadyImported: true,
      pendingCredentialFields: [],
      persisted: true,
    })
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(
      screen.getByText(
        '"Seed Agent (imported)" is already in My drafts. Open it from My drafts to continue.'
      )
    ).toBeInTheDocument()
    expect(localStorage.getItem(DRAFTS_KEY)).toBeNull()
  })

  it('recovers from an import exception and reports an unreadable listing', async () => {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify([seedListing()]))
    mocks.importAgent.mockImplementation(() => {
      throw new Error('corrupt record')
    })
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Import' }))

    expect(
      screen.getByText(
        'Import failed because the stored listing could not be read. Refresh the marketplace and try again.'
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Seed Agent' })).toBeInTheDocument()
  })
})
