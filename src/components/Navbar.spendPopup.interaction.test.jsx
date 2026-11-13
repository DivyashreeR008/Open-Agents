import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

const startedAt = new Date('2026-04-01T09:30:00Z').getTime()

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(
    'oa_session_spend',
    JSON.stringify({
      version: 2,
      startedAt,
      totalSpend: 12.5,
      runs: Array.from({ length: 12 }, (_, index) => ({
        model: `model-${index}`,
        inputTokens: 1,
        outputTokens: 1,
        inputCost: 0.01,
        outputCost: 0.01,
        totalCost: 0.02,
        timestamp: startedAt + index,
      })),
    })
  )
})

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
    </MemoryRouter>
  )
}

describe('Navbar spend popup dismissal', () => {
  it('exposes expanded state and closes from Escape with focus restored', () => {
    renderNavbar()
    const trigger = screen.getByRole('button', { name: 'Session spend' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: 'Session spend details' })).toBeVisible()
    expect(screen.getByText(/Tracked since/)).toBeInTheDocument()
    expect(screen.getByText('Showing newest 10 of 12 runs')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on a pointer press outside the popup', () => {
    renderNavbar()
    const trigger = screen.getByRole('button', { name: 'Session spend' })
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog')).toBeVisible()

    fireEvent.pointerDown(document.body)

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
