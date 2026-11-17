import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], catalogSize: 870 }),
}))

import AboutFeatures from './AboutFeatures'

describe('provider documentation consistency', () => {
  it('names all four supported providers on the About page', () => {
    render(<AboutFeatures />)

    const description = screen.getByRole('heading', {
      level: 3,
      name: 'Multi-LLM Provider Support',
    }).parentElement.textContent

    for (const provider of ['OpenAI', 'Anthropic', 'Google', 'OpenRouter']) {
      expect(description).toContain(provider)
    }
    expect(screen.getByText(/Pit four AI providers head-to-head/)).toBeInTheDocument()
  })

  it('keeps the README provider list in step with the app', () => {
    const readme = readFileSync('README.md', 'utf8')

    expect(readme).toContain('## Supported providers')
    for (const provider of ['OpenAI', 'Anthropic', 'Google Gemini', 'OpenRouter']) {
      expect(readme).toContain(provider)
    }
  })
})
