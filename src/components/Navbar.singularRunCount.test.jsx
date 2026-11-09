import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(
    'oa_session_spend',
    JSON.stringify({
      runs: [{ model: 'gpt-4o', inputTokens: 10, outputTokens: 5, totalCost: 0.002 }],
      totalSpend: 0.002,
    })
  )
})

afterEach(() => {
  localStorage.clear()
})

describe('Navbar singular session run count', () => {
  it('uses singular wording for one recorded run', () => {
    render(
      <MemoryRouter>
        <Navbar sidebarOpen={false} setSidebarOpen={() => {}} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Session spend' }))

    expect(screen.getByText('1 run')).toBeInTheDocument()
  })
})
