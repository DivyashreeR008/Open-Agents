import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import MarketplacePage from './MarketplacePage'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [{ id: 'a1', name: 'Agent One', description: 'd', category: 'Test', provider: 'openai' }], loading: false, error: null }),
}))

describe('Marketplace publish dialog', () => {
  it('takes focus on open, closes on Escape and returns focus to the opener', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    const opener = screen.getByRole('button', { name: /publish to marketplace/i })
    await user.click(opener)

    const dialog = screen.getByRole('dialog', { name: /publish agent to marketplace/i })
    expect(dialog).toContainElement(document.activeElement)
    expect(screen.getByLabelText(/filter agents to publish/i)).toHaveFocus()

    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(opener).toHaveFocus()
  })

  it('closes from the visible Close button', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MarketplacePage /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }))
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
