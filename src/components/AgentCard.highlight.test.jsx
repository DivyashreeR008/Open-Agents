import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}))

import AgentCard from './AgentCard'

const agent = {
  id: 'a1',
  name: 'Grid Agent',
  description: 'Does grid work',
  category: 'Engineering',
  provider: 'openai',
  model: 'gpt-4o',
  icon: 'Bot',
}

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <AgentCard agent={agent} {...props} />
    </MemoryRouter>
  )
}

describe('AgentCard search highlighting', () => {
  it('marks matching fragments and describes the match for screen readers', () => {
    renderCard({ searchQuery: 'grid' })

    const link = screen.getByRole('link', { name: /Grid Agent/ })
    const marks = [...link.querySelectorAll('mark')]

    expect(marks.map((mark) => mark.textContent)).toEqual(['Grid', 'grid'])

    const descriptionId = link.getAttribute('aria-describedby')
    expect(descriptionId).toBeTruthy()
    expect(document.getElementById(descriptionId)).toHaveTextContent(
      'Matches search "grid" in name and description.'
    )
  })

  it('highlights a category match in the row variant', () => {
    renderCard({ variant: 'row', searchQuery: 'engineering' })

    const link = screen.getByRole('link', { name: /Grid Agent/ })
    expect([...link.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual([
      'Engineering',
    ])
  })

  it('highlights a provider match', () => {
    renderCard({ searchQuery: 'openai' })

    const link = screen.getByRole('link', { name: /Grid Agent/ })
    expect([...link.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual(['OpenAI'])
  })

  it('leaves the card untouched when no query is active', () => {
    renderCard()

    const link = screen.getByRole('link', { name: /Grid Agent/ })
    expect(link.querySelector('mark')).toBeNull()
    expect(link).not.toHaveAttribute('aria-describedby')
  })

  it('does not highlight fallback copy that was not part of the search', () => {
    render(
      <MemoryRouter>
        <AgentCard agent={{ id: 'blank', name: 'Blank Agent' }} searchQuery="description" />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: /Blank Agent/ })
    expect(link.querySelector('mark')).toBeNull()
    expect(document.body).not.toHaveTextContent('Matches search "description"')
  })
})
