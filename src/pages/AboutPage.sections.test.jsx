import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [], catalogSize: 1 }) }))

import AboutPage from './AboutPage'

describe('AboutPage section composition', () => {
  it('renders the complete about experience with unique section labels', () => {
    const { container } = render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    )

    expect(document.title).toContain('About')
    expect(
      screen.getByRole('heading', { level: 1, name: /Welcome to OpenAgents/ })
    ).toBeInTheDocument()
    expect(container.querySelectorAll('section').length).toBeGreaterThanOrEqual(6)

    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
