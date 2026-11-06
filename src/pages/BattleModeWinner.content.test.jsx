import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ useDocumentTitle: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: mocks.useDocumentTitle }))

import BattleModeWinner from './BattleModeWinner'

function renderWinner(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/battle/winner', state }]}>
      <Routes>
        <Route path="/battle/winner" element={<BattleModeWinner />} />
      </Routes>
    </MemoryRouter>
  )
}

const state = {
  provider: { label: 'Provider One' },
  content: 'Winning **output**',
  duration: 1200,
  agentName: 'Test Agent',
}

beforeEach(() => vi.clearAllMocks())

describe('BattleModeWinner content', () => {
  it('renders the winner identity, duration, and markdown output', () => {
    renderWinner(state)
    expect(screen.getByRole('heading', { name: 'Winner' })).toBeInTheDocument()
    expect(screen.getByText('Provider One')).toBeInTheDocument()
    expect(screen.getByText(/Agent: Test Agent/)).toBeInTheDocument()
    expect(screen.getByText(/1.2s/)).toBeInTheDocument()
    expect(screen.getAllByText(/Winning/).length).toBeGreaterThan(0)
    expect(screen.getByText('output')).toBeInTheDocument()
  })

  it('uses the agent-specific document title', () => {
    renderWinner(state)
    expect(mocks.useDocumentTitle).toHaveBeenCalledWith('Test Agent Battle Winner')
  })

  it('falls back to the generic title without an agent name', () => {
    renderWinner({ ...state, agentName: undefined })
    expect(mocks.useDocumentTitle).toHaveBeenCalledWith('Battle Winner')
    expect(screen.queryByText(/Agent:/)).not.toBeInTheDocument()
  })
})
