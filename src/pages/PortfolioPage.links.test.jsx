import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], catalogSize: 1 }),
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import PortfolioPage from './PortfolioPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <PortfolioPage />
    </MemoryRouter>
  )
}

describe('PortfolioPage link safety', () => {
  it('opens repository links in a safe new tab', () => {
    renderPage()
    const links = screen.getAllByRole('link', { name: /GitHub|Source code|DivyashreeR008/ })
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) {
      if (!link.getAttribute('href').startsWith('https://github.com')) continue
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    }
  })

  it('keeps the mail link in the same tab', () => {
    renderPage()
    const mail = screen.getByRole('link', { name: /hello@openagents.dev/ })
    expect(mail).toHaveAttribute('href', 'mailto:hello@openagents.dev')
    expect(mail).not.toHaveAttribute('target')
  })

  it('points the skip link at the index section', () => {
    const { container } = renderPage()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#index')
    expect(container.querySelector('#index')).toBeInTheDocument()
  })
})
