import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const favorites = vi.hoisted(() => ({
  toggleFavorite: vi.fn(),
  isFavorite: vi.fn(() => false),
}))

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: favorites.isFavorite,
    toggleFavorite: favorites.toggleFavorite,
  }),
}))

import AgentCard from './AgentCard'

const agent = {
  id: 'drag-agent',
  name: 'Drag Agent',
  description: 'Draggable',
  category: 'Design',
  provider: 'openai',
  icon: 'Bot',
}

function renderCard() {
  return render(
    <MemoryRouter>
      <AgentCard agent={agent} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  favorites.toggleFavorite.mockClear()
  favorites.isFavorite.mockReturnValue(false)
})

describe('AgentCard interactions', () => {
  it('writes the agent id and move effect to the drag payload', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /Drag Agent/ })
    const dataTransfer = { setData: vi.fn(), effectAllowed: '' }

    fireEvent.dragStart(link, { dataTransfer })

    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'drag-agent')
    expect(dataTransfer.effectAllowed).toBe('move')
  })

  it('toggles the favorite with the agent id', () => {
    renderCard()
    fireEvent.click(screen.getByRole('button', { name: 'Add to favorites' }))
    expect(favorites.toggleFavorite).toHaveBeenCalledWith('drag-agent')
  })

  it('reflects a saved favorite in the accessible name', () => {
    favorites.isFavorite.mockReturnValue(true)
    renderCard()
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument()
  })
})
