import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BattleNavbar from './BattleNavbar'

function renderAt(pathname) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <BattleNavbar />
    </MemoryRouter>
  )
}

describe('BattleNavbar light-theme contrast and current state', () => {
  it('uses readable light-theme ink and a solid light surface', () => {
    renderAt('/battle/winner')

    const navigation = screen.getByRole('navigation')
    expect(navigation.className).toContain('bg-white')
    expect(navigation.className).toContain('border-zinc-300')

    const link = screen.getByRole('link', { name: 'Battle Mode' })
    const label = link.querySelector('span')
    expect(label.classList.contains('text-zinc-800')).toBe(true)
    expect(label.classList.contains('text-zinc-200')).toBe(false)
  })

  it('marks the landing route as the current page without marking downstream routes', () => {
    const { unmount } = renderAt('/battle')
    expect(screen.getByRole('link', { name: 'Battle Mode' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    unmount()

    renderAt('/battle/winner')
    expect(screen.getByRole('link', { name: 'Battle Mode' })).not.toHaveAttribute('aria-current')
  })
})
