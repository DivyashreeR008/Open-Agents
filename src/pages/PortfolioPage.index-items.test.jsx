import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], catalogSize: 1 }),
}))

import PortfolioPage from './PortfolioPage'

describe('PortfolioPage product index', () => {
  it('lists all five product areas with stable route targets', () => {
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    )

    for (const number of ['01', '02', '03', '04', '05']) {
      expect(screen.getByText(number)).toBeInTheDocument()
    }
    for (const title of [
      'Agent Catalogue',
      'Battle Mode',
      'Workflow Builder',
      'Automations',
      'Analytics',
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /Workflow Builder/ })).toHaveAttribute(
      'href',
      '/workflows/build'
    )
  })
})
