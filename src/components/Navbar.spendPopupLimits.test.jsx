import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function seedSpend() {
  const runs = Array.from({ length: 11 }, (_, index) => ({
    model: index === 0 ? '' : `model-${index}`,
    inputTokens: 10,
    outputTokens: 5,
    inputCost: 0.001,
    outputCost: 0.001,
    totalCost: 0.002,
  }))
  localStorage.setItem('oa_session_spend', JSON.stringify({ runs, totalSpend: 0.022 }))
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('Navbar spend popup limits', () => {
  it('shows the newest ten runs, labels an unknown model, and toggles closed', () => {
    seedSpend()
    render(
      <MemoryRouter>
        <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Session spend' }))
    expect(screen.getByText('11 runs')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByText('model-9')).toBeInTheDocument()
    expect(screen.queryByText('model-10')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Session spend' }))
    expect(screen.queryByText('Session spend')).not.toBeInTheDocument()
  })
})
