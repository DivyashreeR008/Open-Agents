import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/missing']}>
      <Routes>
        <Route path="/missing" element={<NotFoundPage />} />
        <Route path="/agents" element={<div>agent library</div>} />
        <Route path="/battle" element={<div>battle landing</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('NotFoundPage navigation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('navigates back to the agent library', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Back to agents' }))

    expect(screen.getByText('agent library')).toBeInTheDocument()
  })

  it('focuses the catalogue search after the search shortcut navigates', () => {
    renderPage()
    const search = document.createElement('input')
    search.id = 'agent-search'
    document.body.appendChild(search)

    fireEvent.click(screen.getByRole('button', { name: /search the agent library/i }))
    act(() => vi.advanceTimersByTime(120))

    expect(document.activeElement).toBe(search)
    search.remove()
  })

  it('navigates to battle mode from the secondary action', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Battle mode' }))

    expect(screen.getByText('battle landing')).toBeInTheDocument()
  })
})
