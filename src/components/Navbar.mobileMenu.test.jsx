import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar(onOpenCommandPalette = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar
        sidebarOpen={false}
        setSidebarOpen={() => {}}
        onOpenCommandPalette={onOpenCommandPalette}
      />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Navbar mobile menu actions', () => {
  it('closes the mobile menu when its search affordance opens the palette', () => {
    const openPalette = vi.fn()
    renderNavbar(openPalette)

    const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' })
    fireEvent.click(menuButton)
    fireEvent.click(screen.getByRole('button', { name: /Jump to agent, workflow/i }))

    expect(openPalette).toHaveBeenCalledTimes(1)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the shortcuts dialog from the mobile menu and closes the menu', () => {
    renderNavbar()
    const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' })

    fireEvent.click(menuButton)
    fireEvent.click(screen.getByRole('button', { name: 'Shortcuts' }))

    expect(screen.getByRole('dialog', { name: /Keyboard Shortcuts/i })).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })
})
