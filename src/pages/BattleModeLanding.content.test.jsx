import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BattleModeLanding from './BattleModeLanding'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/battle']}>
      <Routes>
        <Route path="/battle" element={<BattleModeLanding />} />
        <Route path="/battle/setup" element={<div>setup route</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('BattleModeLanding content', () => {
  it('lists the four battle steps in order', () => {
    renderPage()
    const labels = screen.getAllByText(/^Step \d$/).map((node) => node.textContent)

    expect(labels).toEqual(['Step 1', 'Step 2', 'Step 3', 'Step 4'])
    expect(screen.getByText('Pick any agent')).toBeInTheDocument()
    expect(screen.getByText('You pick the winner')).toBeInTheDocument()
  })

  it('opens the setup route from the primary action', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start Battle' }))

    expect(screen.getByText('setup route')).toBeInTheDocument()
  })
})
