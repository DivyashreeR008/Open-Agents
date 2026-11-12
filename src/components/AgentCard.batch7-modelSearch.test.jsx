import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useFavorites', () => ({
  useFavorites: () => ({ isFavorite: () => false, toggleFavorite: vi.fn() }),
}))

import AgentCard from './AgentCard'

const agent = {
  id: 'model-agent',
  name: 'Model Agent',
  description: 'Uses a specific model',
  category: 'Engineering',
  provider: 'openai',
  model: 'gpt-4o-mini',
  icon: 'Bot',
}

describe('AgentCard model-only search matches', () => {
  it('reports a model match when no other field contains the query', () => {
    render(
      <MemoryRouter>
        <AgentCard agent={agent} searchQuery="mini" />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: /Model Agent/ })
    expect(link.querySelector('mark')).toBeNull()
    const descriptionId = link.getAttribute('aria-describedby')
    expect(descriptionId).toBeTruthy()
    expect(document.getElementById(descriptionId)).toHaveTextContent(
      'Matches search "mini" in model.'
    )
  })
})
