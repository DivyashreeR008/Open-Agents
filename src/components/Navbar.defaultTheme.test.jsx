import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

let plainMeta
let changeHandler

function mockSystemTheme(matches) {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn((event, handler) => {
      if (event === 'change') changeHandler = handler
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })
}

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((tag) => tag.remove())
  plainMeta = document.createElement('meta')
  plainMeta.setAttribute('name', 'theme-color')
  plainMeta.setAttribute('content', '#ffffff')
  document.head.appendChild(plainMeta)
  changeHandler = undefined
})

afterEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((tag) => tag.remove())
  vi.restoreAllMocks()
})

describe('Navbar default theme', () => {
  it('follows a light system preference without writing a saved choice', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    mockSystemTheme(false)
    renderNavbar()

    expect(document.documentElement).not.toHaveClass('dark')
    expect(plainMeta).toHaveAttribute('content', '#ffffff')
    expect(localStorage.getItem('oa_theme')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Theme settings' }))
    expect(screen.getByRole('menuitemradio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: /go to homepage/i }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('follows live system changes while system mode is active', () => {
    mockSystemTheme(true)
    renderNavbar()

    expect(document.documentElement).toHaveClass('dark')
    expect(plainMeta).toHaveAttribute('content', '#000000')

    act(() => changeHandler({ matches: false }))

    expect(document.documentElement).not.toHaveClass('dark')
    expect(plainMeta).toHaveAttribute('content', '#ffffff')
    expect(localStorage.getItem('oa_theme')).toBeNull()
  })
})
