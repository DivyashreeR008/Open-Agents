import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
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
  favorites.toggleFavorite.mockReset()
  favorites.toggleFavorite.mockReturnValue({ ok: true })
  favorites.isFavorite.mockReset()
  favorites.isFavorite.mockReturnValue(false)
})

afterEach(() => {
  vi.useRealTimers()
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

  it('surfaces a rejected write without changing the star state', () => {
    const message =
      'Favorites could not be saved. Allow site data for this app or free some browser storage, then try again.'
    favorites.toggleFavorite.mockReturnValue({ ok: false, error: message })
    renderCard()

    fireEvent.click(screen.getByRole('button', { name: 'Add to favorites' }))

    expect(favorites.toggleFavorite).toHaveBeenCalledWith('drag-agent')
    expect(screen.getByRole('alert')).toHaveTextContent(message)
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument()
  })

  it('clears the write error after a later favorite succeeds', () => {
    favorites.toggleFavorite.mockReturnValueOnce({ ok: false, error: 'Storage is blocked.' })
    renderCard()
    const star = screen.getByRole('button', { name: 'Add to favorites' })

    fireEvent.click(star)
    expect(screen.getByRole('alert')).toHaveTextContent('Storage is blocked.')

    fireEvent.click(star)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('dismisses the write error after its timeout', () => {
    vi.useFakeTimers()
    favorites.toggleFavorite.mockReturnValue({ ok: false, error: 'Storage is blocked.' })
    renderCard()

    fireEvent.click(screen.getByRole('button', { name: 'Add to favorites' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(8000))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
