import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BattleModeLanding from './BattleModeLanding'

describe('BattleModeLanding provider lineup', () => {
  it('names all four providers and their implementations', () => {
    render(
      <MemoryRouter>
        <BattleModeLanding />
      </MemoryRouter>
    )

    for (const name of ['GPT-4o', 'Claude', 'Gemini', 'OpenRouter']) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
    for (const label of ['OpenAI', 'Anthropic', 'Google', 'Multi-model']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })
})
