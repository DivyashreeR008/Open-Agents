import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AgentsProvider } from '../lib/useAgents'
import AboutPage from './AboutPage'
import NotFoundPage from './NotFoundPage'
import Privacy from './Privacy'
import TermsOfService from './TermsOfService'

function renderWithRouter(ui, initialEntries = ['/']) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('AboutPage', () => {
  it('renders the project story and sets a descriptive document title', () => {
    renderWithRouter(
      <AgentsProvider>
        <AboutPage />
      </AgentsProvider>
    )

    expect(screen.getByRole('heading', { name: /welcome to openagents/i })).toBeInTheDocument()
    expect(document.title).toBe('About \u2014 Open Agents')
  })
})

describe('NotFoundPage', () => {
  const routes = (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/agents" element={<div>agent library</div>} />
      <Route path="/battle" element={<div>battle landing</div>} />
    </Routes>
  )

  it('explains the missing route', () => {
    renderWithRouter(routes, ['/missing'])

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
    expect(document.title).toBe('Page not found \u2014 Open Agents')
  })

  it('offers a route back to the agent library', () => {
    renderWithRouter(routes, ['/missing'])

    fireEvent.click(screen.getByRole('button', { name: /back to agents/i }))

    expect(screen.getByText('agent library')).toBeInTheDocument()
  })

  it('offers a route into battle mode', () => {
    renderWithRouter(routes, ['/missing'])

    fireEvent.click(screen.getByRole('button', { name: /battle mode/i }))

    expect(screen.getByText('battle landing')).toBeInTheDocument()
  })

  it('navigates to search and focuses the search field', () => {
    vi.useFakeTimers()
    renderWithRouter(
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/agents" element={<input aria-label="Search agents" id="agent-search" />} />
      </Routes>,
      ['/missing']
    )

    fireEvent.click(screen.getByRole('button', { name: /search the agent library/i }))
    act(() => {
      vi.runOnlyPendingTimers()
    })

    expect(screen.getByLabelText('Search agents')).toHaveFocus()
  })
})

describe('legal pages', () => {
  it('renders the privacy policy and returns to the previous page', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    renderWithRouter(<Privacy />)

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByText(/information we collect/i)).toBeInTheDocument()
    expect(document.title).toBe('Privacy Policy \u2014 Open Agents')

    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(back).toHaveBeenCalledTimes(1)
  })

  it('renders the terms of service and returns to the previous page', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    renderWithRouter(<TermsOfService />)

    expect(screen.getByRole('heading', { name: 'Terms of Service' })).toBeInTheDocument()
    expect(screen.getByText(/acceptance of terms/i)).toBeInTheDocument()
    expect(document.title).toBe('Terms of Service \u2014 Open Agents')

    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(back).toHaveBeenCalledTimes(1)
  })
})
