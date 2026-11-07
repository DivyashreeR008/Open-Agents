import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'

const agents = [
  {
    id: 'alpha',
    name: 'Alpha Agent',
    description: 'Writes things',
    category: 'Engineering',
    provider: 'openai',
    icon: 'Bot',
    systemPrompt: 'Be helpful.',
  },
]

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents, loading: false, catalogSize: agents.length }),
}))
vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    isFavorite: () => false,
    toggleFavorite: vi.fn(),
  }),
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
vi.mock('../lib/globalKeys', () => ({
  getGlobalKeys: () => ({ openai: 'stored', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))
vi.mock('../components/RecentRuns', () => ({
  default: ({ onRerun, onCopy }) => (
    <div>
      <button
        type="button"
        onClick={() => onRerun({ agentId: 'alpha', inputs: { topic: 'mars' } })}
      >
        Fake rerun
      </button>
      <button type="button" onClick={() => onCopy('latest output')}>
        Fake copy
      </button>
    </div>
  ),
}))

import HomePage from './HomePage'

function LocationProbe() {
  const { pathname, state } = useLocation()
  return (
    <>
      <output data-testid="route-path">{pathname}</output>
      <output data-testid="route-state">{JSON.stringify(state?.prefill || null)}</output>
    </>
  )
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <HomePage />
      <LocationProbe />
    </MemoryRouter>
  )
}

describe('HomePage recent run actions', () => {
  beforeEach(() => {
    localStorage.clear()
    document.execCommand = vi.fn(() => true)
  })

  afterEach(() => {
    delete document.execCommand
    delete navigator.clipboard
  })

  it('navigates to the agent with the previous inputs as a prefill', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Fake rerun' }))

    expect(screen.getByTestId('route-path')).toHaveTextContent('/agent/alpha')
    expect(screen.getByTestId('route-state')).toHaveTextContent('{"topic":"mars"}')
  })

  it('uses the clipboard when the browser exposes a working implementation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Fake copy' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('latest output'))
    expect(document.execCommand).not.toHaveBeenCalled()
  })

  it('falls back to a hidden textarea when the clipboard write rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('permission denied'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Fake copy' }))

    await waitFor(() => expect(document.execCommand).toHaveBeenCalledWith('copy'))
    expect(document.querySelectorAll('textarea')).toHaveLength(1)
  })
})
