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

beforeEach(() => vi.clearAllMocks())

describe('PortfolioPage index', () => {
  it('falls back to the registry size when the catalogue is empty', () => {
    mocks.useAgents.mockReturnValue({ agents: [], catalogSize: 872 })
    renderPage()
    expect(screen.getAllByText('872').length).toBeGreaterThan(0)
    expect(screen.getByText(/872 agents,/)).toBeInTheDocument()
  })

  it('uses the loaded agent count when the catalogue has entries', () => {
    mocks.useAgents.mockReturnValue({ agents: [{ id: 'a' }, { id: 'b' }], catalogSize: 872 })
    renderPage()
    expect(screen.getByText(/2 agents,/)).toBeInTheDocument()
  })

  it('links every index row to its destination', () => {
    mocks.useAgents.mockReturnValue({ agents: [], catalogSize: 10 })
    renderPage()
    const expected = [
      ['Agent Catalogue', '/agents'],
      ['Battle Mode', '/battle'],
      ['Workflow Builder', '/workflows/build'],
      ['Automations', '/automations'],
      ['Analytics', '/analytics'],
    ]
    for (const [name, href] of expected) {
      expect(screen.getByRole('link', { name: new RegExp(name) })).toHaveAttribute('href', href)
    }
  })
})
