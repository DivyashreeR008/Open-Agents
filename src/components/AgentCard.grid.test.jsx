import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}))

import AgentCard from './AgentCard'

function renderCard(agent, props = {}) {
  return render(
    <MemoryRouter>
      <AgentCard agent={agent} {...props} />
    </MemoryRouter>
  )
}

const baseAgent = {
  id: 'agent-1',
  name: 'Grid Agent',
  description: 'Does grid work',
  category: 'Engineering',
  provider: 'openai',
  icon: 'Bot',
  createdAt: new Date().toISOString(),
}

describe('AgentCard grid variant', () => {
  it('renders fallback text for missing name and description', () => {
    renderCard({ id: 'fallback' })
    expect(screen.getByRole('heading', { name: 'Unnamed agent' })).toBeInTheDocument()
    expect(screen.getByText('No description provided.')).toBeInTheDocument()
    expect(screen.getByText('Any provider')).toBeInTheDocument()
  })

  it('maps known providers and falls back for unknown ones', () => {
    renderCard({ ...baseAgent, name: 'Known', provider: 'anthropic' })
    expect(screen.getByText('Anthropic')).toBeInTheDocument()

    renderCard({ ...baseAgent, id: 'unknown', name: 'Unknown', provider: 'local' })
    expect(screen.getByText('Any provider')).toBeInTheDocument()
  })

  it('shows the new badge only for dates inside the last seven days', () => {
    const recent = renderCard({ ...baseAgent, name: 'Recent' })
    expect(screen.getAllByText('new').length).toBeGreaterThan(0)
    recent.unmount()

    renderCard({ ...baseAgent, id: 'old', name: 'Old', createdAt: '2020-01-01T00:00:00.000Z' })
    expect(screen.queryByText('new')).not.toBeInTheDocument()
  })

  it('hides the new badge for invalid or missing dates', () => {
    const invalid = renderCard({ ...baseAgent, name: 'Invalid', createdAt: 'not-a-date' })
    expect(screen.queryByText('new')).not.toBeInTheDocument()
    invalid.unmount()

    renderCard({ ...baseAgent, id: 'none', name: 'None', createdAt: undefined })
    expect(screen.queryByText('new')).not.toBeInTheDocument()
  })

  it('honors an explicit freshness decision from the catalogue', () => {
    const selected = renderCard(
      { ...baseAgent, name: 'Selected', createdAt: '2020-01-01T00:00:00.000Z' },
      { isNew: true }
    )
    expect(screen.getByText('new')).toBeInTheDocument()
    selected.unmount()

    renderCard({ ...baseAgent, id: 'suppressed', name: 'Suppressed' }, { isNew: false })
    expect(screen.queryByText('new')).not.toBeInTheDocument()
  })
})
