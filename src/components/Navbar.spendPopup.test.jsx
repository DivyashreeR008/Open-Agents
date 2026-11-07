import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function seedSpend() {
  localStorage.setItem(
    'oa_session_spend',
    JSON.stringify({
      runs: [
        {
          model: 'gpt-4o-mini',
          inputTokens: 100,
          outputTokens: 50,
          inputCost: 0.01,
          outputCost: 0.02,
          totalCost: 0.03,
        },
        {
          model: 'claude-3-5-haiku-20241022',
          inputTokens: 20,
          outputTokens: 10,
          inputCost: 0.005,
          outputCost: 0.005,
          totalCost: 0.01,
        },
      ],
      totalSpend: 0.04,
    })
  )
}

function renderNavbar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('Navbar session spend popup', () => {
  it('opens the spend breakdown and resets the stored session', () => {
    seedSpend()
    renderNavbar()

    fireEvent.click(screen.getByRole('button', { name: 'Session spend' }))

    expect(screen.getByText('gpt-4o-mini')).toBeInTheDocument()
    expect(screen.getByText('claude-3-5-haiku-20241022')).toBeInTheDocument()
    expect(screen.getByText('2 runs')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }))

    expect(localStorage.getItem('oa_session_spend')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Session spend' })).not.toBeInTheDocument()
  })
})
