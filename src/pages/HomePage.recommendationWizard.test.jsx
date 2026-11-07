import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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

const state = vi.hoisted(() => ({ loading: false }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents, loading: state.loading, catalogSize: agents.length }),
}))
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
vi.mock('../lib/globalKeys', () => ({
  getGlobalKeys: () => ({ openai: 'stored-key', anthropic: '', gemini: '', openrouter: '' }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: () => {} }))
vi.mock('../hooks/useKeyboardShortcuts', () => ({ useKeyboardShortcuts: () => {} }))

vi.mock('../components/recommendation/RecommendationWizardEntry', async () => {
  const { forwardRef } = await import('react')
  return {
    default: forwardRef(function MockEntry({ onOpen, disabled, loading }, ref) {
      return (
        <button ref={ref} type="button" onClick={onOpen} disabled={disabled}>
          {loading ? 'Loading recommendations' : 'Find my agent'}
        </button>
      )
    }),
  }
})

vi.mock('../components/recommendation/RecommendationWizardModal', () => ({
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <div role="dialog" aria-label="Recommendation wizard">
        <button type="button" onClick={onClose}>
          Close recommendation
        </button>
      </div>
    ) : null,
}))

import HomePage from './HomePage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/agents']}>
      <HomePage />
    </MemoryRouter>
  )
}

describe('HomePage recommendation wizard entry', () => {
  beforeEach(() => {
    localStorage.clear()
    state.loading = false
  })

  it('opens the recommendation wizard and closes it from the dialog action', () => {
    renderPage()

    expect(screen.queryByRole('dialog', { name: 'Recommendation wizard' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Find my agent' }))
    expect(screen.getByRole('dialog', { name: 'Recommendation wizard' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close recommendation' }))
    expect(screen.queryByRole('dialog', { name: 'Recommendation wizard' })).toBeNull()
  })

  it('disables the entry and shows loading copy while the catalogue loads', () => {
    state.loading = true
    renderPage()

    const entry = screen.getByRole('button', { name: 'Loading recommendations' })
    expect(entry).toBeDisabled()
    fireEvent.click(entry)
    expect(screen.queryByRole('dialog', { name: 'Recommendation wizard' })).toBeNull()
  })
})
