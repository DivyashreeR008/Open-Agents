import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({ drafts: [], result: false }))

vi.mock('../lib/marketplace', () => ({
  loadDrafts: () => state.drafts,
  removeDraft: () => state.result,
}))

import MarketplaceDraftsPage from './MarketplaceDraftsPage'

const draft = {
  id: 'd1',
  name: 'Draft one',
  description: '',
  pendingCredentialFields: [],
}

function renderPage() {
  return render(
    <MemoryRouter>
      <MarketplaceDraftsPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  state.drafts = [draft]
  state.result = false
})

describe('MarketplaceDraftsPage removal feedback', () => {
  it('explains a failed removal and keeps the draft in the list', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Remove Draft one' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Could not remove Draft one')
    expect(screen.getByRole('heading', { level: 2, name: 'Draft one' })).toBeInTheDocument()
  })

  it('clears an earlier error after a successful removal', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Remove Draft one' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    state.drafts = []
    state.result = true
    fireEvent.click(screen.getByRole('button', { name: 'Remove Draft one' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No imported drafts' })).toBeInTheDocument()
  })
})
