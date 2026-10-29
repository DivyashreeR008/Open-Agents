import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PortfolioPage from './PortfolioPage'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], catalogSize: 0, loading: false }),
}))

// jsdom has no layout, so this only guards the classes that keep the header
// inside a 320px screen. The real check is done in a browser at 320/375/390/430.
describe('PortfolioPage header', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>,
    )

  it('keeps Index and GitHub visible on phones and hides the two extra links below sm', () => {
    renderPage()
    const header = screen.getByRole('banner')
    const link = (name) => Array.from(header.querySelectorAll('nav a')).find((a) => a.textContent.trim().startsWith(name))

    expect(link('Index').className).not.toMatch(/\bhidden\b/)
    expect(link('GitHub').className).not.toMatch(/\bhidden\b/)
    expect(link('Stack').className).toMatch(/\bhidden\b.*\bsm:inline\b/)
    expect(link('License').className).toMatch(/\bhidden\b.*\bsm:inline\b/)
  })

  it('gives the logo and nav room instead of letting them touch', () => {
    renderPage()
    const row = screen.getByRole('banner').firstElementChild
    expect(row.className).toMatch(/\bgap-4\b/)
    expect(row.className).toMatch(/\bpx-4\b/)
    expect(screen.getByRole('link', { name: 'openagents_' }).className).toMatch(/\bshrink-0\b/)
  })
})
