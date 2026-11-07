import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./components/Navbar', () => ({
  default: ({ sidebarOpen, setSidebarOpen, onOpenCommandPalette }) => (
    <nav aria-label="Test navigation">
      <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)}>
        Toggle sidebar
      </button>
      <button type="button" onClick={onOpenCommandPalette}>
        Open palette
      </button>
    </nav>
  ),
}))

vi.mock('./components/Sidebar', () => ({
  default: ({ open }) => <aside data-testid="sidebar">{open ? 'open' : 'closed'}</aside>,
}))

vi.mock('./components/CommandPalette', () => ({
  default: ({ isOpen, onClose }) =>
    isOpen ? (
      <div role="dialog" aria-label="Command palette">
        <button type="button" onClick={onClose}>
          Close palette
        </button>
      </div>
    ) : null,
}))

vi.mock('./components/ScrollToTopButton', () => ({ default: () => null }))
vi.mock('./components/ScrollToBottom', () => ({ default: () => null }))
vi.mock('./components/RouteAnnouncer', () => ({ default: () => null }))
vi.mock('./components/PageTransition', () => ({
  default: ({ children }) => <div>{children}</div>,
}))
vi.mock('./pages/Privacy', () => ({
  default: () => <h1>Privacy page</h1>,
}))

import App from './App'

function renderApp(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('App edge routes', () => {
  it('falls back to the not-found page for an unknown route inside the shell', async () => {
    renderApp('/definitely-not-a-route')

    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Give feedback' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('opens the shell controls on a known route and closes the palette', async () => {
    renderApp('/privacy')

    expect(await screen.findByRole('heading', { name: 'Privacy page' })).toBeInTheDocument()
    expect(screen.getByTestId('sidebar')).toHaveTextContent('closed')

    fireEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }))
    expect(screen.getByTestId('sidebar')).toHaveTextContent('open')

    fireEvent.click(screen.getByRole('button', { name: 'Open palette' }))
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Close palette' }))
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument()
  })

  it('toggles the command palette with both Control+K spellings', async () => {
    renderApp('/privacy')
    await screen.findByRole('heading', { name: 'Privacy page' })

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'K', ctrlKey: true })
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
  })
})
