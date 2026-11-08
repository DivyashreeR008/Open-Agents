import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar sidebarOpen={false} setSidebarOpen={vi.fn()} {...props} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
  document.getElementById('agent-search')?.remove()
})

describe('Navbar controls and catalogue fallback', () => {
  it('focuses an already mounted catalogue search when no palette handler is supplied', () => {
    const searchInput = document.createElement('input')
    searchInput.id = 'agent-search'
    document.body.appendChild(searchInput)

    renderNavbar()

    fireEvent.click(screen.getByRole('button', { name: /Search agents, workflows, settings/i }))

    expect(searchInput).toHaveFocus()
  })

  it('toggles the sidebar and scrolls home when the brand is clicked', () => {
    const setSidebarOpen = vi.fn()
    renderNavbar({ setSidebarOpen })

    fireEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    expect(setSidebarOpen).toHaveBeenCalledWith(true)

    fireEvent.click(screen.getByRole('link', { name: /go to homepage/i }))
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('tracks the mobile navigation menu expanded state', () => {
    renderNavbar()

    const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })
})
