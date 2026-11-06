import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import BattleModeWinner from './BattleModeWinner'

const state = {
  provider: { label: 'Provider' },
  content: 'Winning output',
  duration: 1200,
  agentName: 'Agent',
}

function renderWinner() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/battle/winner', state }]}>
      <Routes>
        <Route path="/battle/winner" element={<BattleModeWinner />} />
        <Route path="/battle/setup" element={<div>Battle setup page</div>} />
        <Route path="/agents" element={<div>Agent catalogue page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('BattleModeWinner navigation', () => {
  it('opens the battle setup route for a rematch', () => {
    renderWinner()
    fireEvent.click(screen.getByRole('button', { name: /Run Battle Again/ }))
    expect(screen.getByText('Battle setup page')).toBeInTheDocument()
  })

  it('opens the agent catalogue from the result', () => {
    renderWinner()
    fireEvent.click(screen.getByRole('button', { name: /Back to Agents/ }))
    expect(screen.getByText('Agent catalogue page')).toBeInTheDocument()
  })
})
