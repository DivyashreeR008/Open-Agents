import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ useAgents: vi.fn() }))

vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import PortfolioPage from './PortfolioPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <PortfolioPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useAgents.mockReturnValue({ agents: [], catalogSize: 12 })
})

describe('PortfolioPage supporting content', () => {
  it('lists the full stack table', () => {
    renderPage()
    for (const label of ['Frontend', 'Routing', 'Backend', 'Agents', 'Testing']) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
    expect(screen.getByText(/Vitest/)).toBeInTheDocument()
  })

  it('states the license and renders the repository and mail links', () => {
    renderPage()
    expect(screen.getByText(/MIT licensed/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /DivyashreeR008\/Open-Agents/ })).toHaveAttribute(
      'href',
      'https://github.com/DivyashreeR008/Open-Agents'
    )
    expect(screen.getByRole('link', { name: /hello@openagents.dev/ })).toHaveAttribute(
      'href',
      'mailto:hello@openagents.dev'
    )
  })

  it('renders the current year in the footer', () => {
    renderPage()
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument()
  })
})
