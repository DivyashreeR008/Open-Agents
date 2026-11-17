import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], catalogSize: 1 }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import PortfolioPage from './PortfolioPage'

describe('PortfolioPage stack copy', () => {
  it('reports the framework versions used by the workspace', () => {
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    )

    expect(screen.getByText('React 19, Vite 8, Tailwind CSS 4')).toBeInTheDocument()
    expect(screen.getByText('React Router 7, lazy-loaded routes')).toBeInTheDocument()
    expect(
      screen.queryByText(/React 18|Vite 6|Tailwind CSS 3|React Router 6/)
    ).not.toBeInTheDocument()
  })
})
