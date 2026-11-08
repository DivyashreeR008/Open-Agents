import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

let plainMeta

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((tag) => tag.remove())
  plainMeta = document.createElement('meta')
  plainMeta.setAttribute('name', 'theme-color')
  plainMeta.setAttribute('content', '#ffffff')
  document.head.appendChild(plainMeta)
})

afterEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((tag) => tag.remove())
  vi.restoreAllMocks()
})

describe('Navbar default theme', () => {
  it('starts in dark mode without a saved preference and scrolls to top from the logo', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(
      <MemoryRouter>
        <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
      </MemoryRouter>
    )

    expect(document.documentElement).toHaveClass('dark')
    expect(plainMeta).toHaveAttribute('content', '#000000')
    expect(localStorage.getItem('oa_theme')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Session spend' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: /go to homepage/i }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
