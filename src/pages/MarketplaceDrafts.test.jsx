import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MarketplaceDraftsPage from './MarketplaceDraftsPage'
import MarketplaceDraftPage from './MarketplaceDraftPage'
import MarketplacePage from './MarketplacePage'
import { publishAgent, importAgent, loadDrafts, removeDraft } from '../lib/marketplace'
import { expectNoA11yViolations } from '../test/a11y'

vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => <div data-testid="runner">{agent.name}</div>,
}))
vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    loading: false,
    agents: [{ id: 'summarizer', name: 'Summarizer', provider: 'openai', systemPrompt: 'p', inputs: [] }],
  }),
}))

function renderRoutes(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/marketplace/drafts" element={<MarketplaceDraftsPage />} />
        <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
      </Routes>
    </MemoryRouter>
  )
}

function seed(config) {
  const listing = publishAgent({
    name: 'Pack',
    description: 'desc',
    category: 'Research',
    config: { baseAgentId: 'summarizer', ...config },
  })
  return importAgent(listing.id)
}

describe('imported drafts pages', () => {
  beforeEach(() => localStorage.clear())

  it('shows an empty state when there are no drafts', () => {
    renderRoutes('/marketplace/drafts')
    expect(screen.getByText('No imported drafts')).toBeInTheDocument()
  })

  it('lists drafts, links to them and removes one', async () => {
    const draft = seed({})
    const { container } = renderRoutes('/marketplace/drafts')
    expect(screen.getByText('Pack (imported)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute(
      'href',
      `/marketplace/drafts/${draft.id}`
    )
    await expectNoA11yViolations(container)

    fireEvent.click(screen.getByRole('button', { name: 'Remove Pack (imported)' }))
    expect(screen.getByText('No imported drafts')).toBeInTheDocument()
    expect(loadDrafts()).toHaveLength(0)
  })

  it('runs a draft with no flagged fields straight away', () => {
    const draft = seed({})
    renderRoutes(`/marketplace/drafts/${draft.id}`)
    expect(screen.getByTestId('runner')).toHaveTextContent('Pack (imported)')
  })

  it('keeps the runner locked until flagged fields are filled', async () => {
    const draft = seed({ apiKey: 'sk-live-abc' })
    const { container } = renderRoutes(`/marketplace/drafts/${draft.id}`)
    expect(screen.queryByTestId('runner')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Complete 1 more field')
    await expectNoA11yViolations(container)

    fireEvent.change(screen.getByLabelText('apiKey'), { target: { value: 'my-own-value' } })
    expect(screen.getByTestId('runner')).toBeInTheDocument()
    // the typed value never reaches storage
    const dump = Array.from({ length: localStorage.length }, (_, i) =>
      localStorage.getItem(localStorage.key(i))
    ).join('\n')
    expect(dump).not.toContain('my-own-value')
    expect(dump).toContain('Pack')
  })

  it('says so when the base agent is gone and still allows removing', () => {
    const draft = seed({ baseAgentId: 'gone' })
    renderRoutes(`/marketplace/drafts/${draft.id}`)
    expect(screen.getByText('This draft cannot run')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /remove draft/i }))
    expect(screen.getByText('No imported drafts')).toBeInTheDocument()
  })

  it('shows not found for an unknown draft id', () => {
    renderRoutes('/marketplace/drafts/nope')
    expect(screen.getByText('Draft not found')).toBeInTheDocument()
  })

  it('marketplace listing shows imported state from stored drafts and clears it on remove', () => {
    const draft = seed({})
    const { unmount } = render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: 'Imported' })).toBeDisabled()
    expect(screen.getByRole('link', { name: /my drafts \(1\)/i })).toHaveAttribute(
      'href',
      '/marketplace/drafts'
    )
    unmount()

    removeDraft(draft.id)
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: 'Import' })).toBeEnabled()
  })
})
