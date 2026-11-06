import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BattleNavbar from './BattleNavbar'

function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={['/battle/winner']}>
      <BattleNavbar />
    </MemoryRouter>
  )
}

describe('BattleNavbar', () => {
  it('renders a navigation landmark with a link back to battle mode', () => {
    renderNavbar()

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /battle mode/i })
    expect(link).toHaveAttribute('href', '/battle')
  })

  it('keeps the icon decorative so the link has one accessible name', () => {
    const { container } = renderNavbar()
    const icon = container.querySelector('svg')

    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('link', { name: 'Battle Mode' })).toBeInTheDocument()
  })

  it('uses the documented full-width navigation classes', () => {
    renderNavbar()

    const navigation = screen.getByRole('navigation')
    expect(navigation.className).toContain('fixed')
    expect(navigation.className).toContain('top-0')
    expect(navigation.className).toContain('h-11')
  })
})
