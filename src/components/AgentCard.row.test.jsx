import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}))

import AgentCard from './AgentCard'

const agent = {
  id: 'row-agent',
  name: 'Row Agent',
  description: 'Renders as a row',
  category: 'Research',
  provider: 'gemini',
  icon: 'Bot',
}

function renderRow(props = {}) {
  return render(
    <MemoryRouter>
      <AgentCard agent={agent} variant="row" {...props} />
    </MemoryRouter>
  )
}

describe('AgentCard row variant', () => {
  it('formats a numeric index to three digits', () => {
    renderRow({ index: 7 })
    expect(screen.getByText('007')).toBeInTheDocument()
  })

  it('uses a dash placeholder when no index is supplied', () => {
    renderRow()
    expect(screen.getByText('\u2014')).toBeInTheDocument()
  })

  it('links to the agent and exposes category and provider labels', () => {
    renderRow({ index: 1 })
    expect(screen.getByRole('link', { name: /Row Agent/ })).toHaveAttribute('href', '/agent/row-agent')
    expect(screen.getByText('Research')).toBeInTheDocument()
    expect(screen.getByText('Gemini')).toBeInTheDocument()
  })

  it('keeps actions available to keyboard focus', () => {
    const { container } = renderRow({ index: 2 })
    const actions = screen.getByRole('button', { name: 'Add to favorites' }).parentElement
    expect(actions.className).toContain('group-focus-within:opacity-100')
    expect(container.querySelector('.index-row')).toBeInTheDocument()
  })
})
