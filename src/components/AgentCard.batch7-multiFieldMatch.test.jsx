import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}))

import AgentCard from './AgentCard'

function renderCard(agent, searchQuery) {
  return render(
    <MemoryRouter>
      <AgentCard agent={agent} searchQuery={searchQuery} />
    </MemoryRouter>
  )
}

describe('AgentCard multiple match fields', () => {
  it('joins two matching fields with and', () => {
    renderCard(
      {
        id: 'a1',
        name: 'Alpha Agent',
        description: 'Alpha helper',
        category: 'Engineering',
        provider: 'openai',
        icon: 'Bot',
      },
      'alpha'
    )

    const link = screen.getByRole('link', { name: /Alpha Agent/ })
    const descriptionId = link.getAttribute('aria-describedby')
    expect(document.getElementById(descriptionId)).toHaveTextContent(
      'Matches search "alpha" in name and description.'
    )
  })

  it('uses a serial comma for three or more matching fields', () => {
    renderCard(
      {
        id: 'a2',
        name: 'GPT Agent',
        description: 'GPT helper',
        category: 'Engineering',
        provider: 'openai',
        model: 'gpt-4o-mini',
        icon: 'Bot',
      },
      'gpt'
    )

    const link = screen.getByRole('link', { name: /GPT Agent/ })
    const descriptionId = link.getAttribute('aria-describedby')
    expect(document.getElementById(descriptionId)).toHaveTextContent(
      'Matches search "gpt" in name, description, and model.'
    )
  })
})
