import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { expectNoA11yViolations } from '../test/a11y'
import { clearGlobalKey, saveGlobalKeys } from '../lib/globalKeys'

const agents = [
  {
    id: 'alpha',
    name: 'Alpha Agent',
    description: 'Writes things',
    category: 'Engineering',
    provider: 'openai',
    icon: 'Bot',
  },
  {
    id: 'beta',
    name: 'Beta Agent',
    description: 'Draws things',
    category: 'Design',
    provider: 'anthropic',
    icon: 'Bot',
  },
  {
    id: 'flex',
    name: 'Flexible Agent',
    description: 'Works with a selected provider',
    category: 'Engineering',
    provider: 'any',
    icon: 'Bot',
  },
]
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents, loading: false }) }))
vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ favorites: [], isFavorite: () => false, toggleFavorite: vi.fn() }),
}))
vi.mock('../lib/useHistory', () => ({
  useHistory: () => ({ history: [], deleteRun: vi.fn(), clearHistory: vi.fn() }),
}))
vi.mock('../lib/useCollections', () => ({
  DEFAULT_COLLECTION_ID: 'all',
  useCollections: () => ({
    collections: [],
    getAgentCollectionId: () => 'all',
    moveAgentToCollection: () => ({ ok: true }),
  }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))
import HomePage from './HomePage'

function Probe() {
  return <output data-testid="url">{useLocation().search}</output>
}
function show(url = '/agents') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <HomePage />
      <Probe />
    </MemoryRouter>
  )
}
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('catalogue saved-key filter', () => {
  it('shows requirements on row and grid cards before composing a run', () => {
    show()
    expect(screen.getByText('Needs OpenAI key')).toBeInTheDocument()
    expect(screen.getByText('Needs Anthropic key')).toBeInTheDocument()
    expect(screen.getByText('Needs a provider key')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /grid view/i }))
    expect(screen.getByText('Needs OpenAI key')).toBeInTheDocument()
  })

  it('filters by saved keys, includes any-provider agents, and preserves other scope', () => {
    saveGlobalKeys({ openai: 'synthetic-fixture' })
    show('/agents?category=Engineering')
    fireEvent.click(screen.getByRole('button', { name: 'With saved keys' }))
    expect(screen.getByTestId('url')).toHaveTextContent('ready=1')
    expect(screen.getByTestId('url')).toHaveTextContent('category=Engineering')
    const list = screen.getByRole('list', { name: 'Agent catalogue, index view' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Saved key available · choose provider')).toBeInTheDocument()
    expect(document.body.textContent).not.toContain('synthetic-fixture')
    expect(screen.getByTestId('url').textContent).not.toContain('synthetic-fixture')
    fireEvent.click(screen.getByRole('button', { name: 'Reset', exact: true }))
    expect(screen.getByTestId('url')).not.toHaveTextContent('ready=1')
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
  })

  it('restores the URL filter and updates after key removal without a reload', () => {
    saveGlobalKeys({ anthropic: 'synthetic' })
    show('/agents?ready=1&provider=anthropic')
    expect(screen.getByText('Beta Agent')).toBeInTheDocument()
    act(() => {
      clearGlobalKey('anthropic')
      window.dispatchEvent(new Event('focus'))
    })
    expect(screen.queryByText('Beta Agent')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add a provider key in Settings' })).toHaveAttribute(
      'href',
      '/settings'
    )
    expect(screen.getByRole('button', { name: 'With saved keys' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('offers accessible controls and a recovery path when no saved keys exist', async () => {
    const { container } = show('/agents?ready=1')
    expect(
      screen.queryByRole('list', { name: 'Agent catalogue, index view' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Add a provider key in Settings' })).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })
})
