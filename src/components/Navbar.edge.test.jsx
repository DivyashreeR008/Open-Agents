import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

function AgentsProbe() {
  const location = useLocation()
  return <div>agents page focus={String(location.state?.focusSearch)}</div>
}

function renderNavbar(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={<Navbar sidebarOpen={false} setSidebarOpen={vi.fn()} {...props} />}
        />
        <Route path="/agents" element={<AgentsProbe />} />
      </Routes>
    </MemoryRouter>
  )
}

let plainMeta
let darkMediaMeta
let lightMediaMeta

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((tag) => tag.remove())

  plainMeta = document.createElement('meta')
  plainMeta.setAttribute('name', 'theme-color')
  plainMeta.setAttribute('content', '#000000')
  document.head.appendChild(plainMeta)

  darkMediaMeta = document.createElement('meta')
  darkMediaMeta.setAttribute('name', 'theme-color')
  darkMediaMeta.setAttribute('content', '#000000')
  darkMediaMeta.setAttribute('media', '(prefers-color-scheme: dark)')
  document.head.appendChild(darkMediaMeta)

  lightMediaMeta = document.createElement('meta')
  lightMediaMeta.setAttribute('name', 'theme-color')
  lightMediaMeta.setAttribute('content', '#ffffff')
  lightMediaMeta.setAttribute('media', '(prefers-color-scheme: light)')
  document.head.appendChild(lightMediaMeta)
})

afterEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  document.head.querySelectorAll('meta[name="theme-color"]').forEach((tag) => tag.remove())
  document.getElementById('agent-search')?.remove()
})

describe('Navbar theme and search affordances', () => {
  it('applies a saved light theme, updates only the unqualified theme-color tag, and persists choices', () => {
    localStorage.setItem('oa_theme', 'light')
    renderNavbar()

    expect(document.documentElement).not.toHaveClass('dark')
    expect(plainMeta).toHaveAttribute('content', '#ffffff')
    expect(darkMediaMeta).toHaveAttribute('content', '#000000')
    expect(lightMediaMeta).toHaveAttribute('content', '#ffffff')

    fireEvent.click(screen.getByRole('button', { name: 'Theme settings' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Dark' }))
    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('oa_theme')).toBe('dark')
    expect(plainMeta).toHaveAttribute('content', '#000000')

    fireEvent.click(screen.getByRole('button', { name: 'Theme settings' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'System' }))
    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('oa_theme')).toBeNull()
    expect(plainMeta).toHaveAttribute('content', '#ffffff')
  })

  it('prefers the command palette handler over a mounted catalogue search', () => {
    const searchInput = document.createElement('input')
    searchInput.id = 'agent-search'
    document.body.appendChild(searchInput)

    const onOpenCommandPalette = vi.fn()
    renderNavbar({ onOpenCommandPalette })

    fireEvent.click(screen.getByRole('button', { name: /Search agents, workflows, settings/i }))
    expect(onOpenCommandPalette).toHaveBeenCalledTimes(1)
    expect(searchInput).not.toHaveFocus()
  })

  it('navigates to the agent catalogue with a focus request when no search target exists', () => {
    renderNavbar()

    fireEvent.click(screen.getByRole('button', { name: /Search agents, workflows, settings/i }))

    expect(screen.getByText('agents page focus=true')).toBeInTheDocument()
  })

  it('opens shortcuts with "?" but ignores the same key while typing in a field', () => {
    renderNavbar()

    fireEvent.keyDown(window, { key: '?' })
    expect(screen.getByRole('dialog', { name: /Keyboard Shortcuts/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Close keyboard shortcuts dialog/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const typingTarget = document.createElement('input')
    document.body.appendChild(typingTarget)
    typingTarget.focus()
    fireEvent.keyDown(typingTarget, { key: '?' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    typingTarget.remove()
  })
})
