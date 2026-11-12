import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import MarketplacePage from './MarketplacePage'

const agents = Array.from({ length: 30 }, (_, index) => ({
  id: `agent-${index + 1}`,
  name: `Marketplace Agent ${String(index + 1).padStart(2, '0')}`,
  description: 'Publishable agent',
  category: 'Test',
  provider: 'openai',
  systemPrompt: 'Test.',
}))

vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents, loading: false }) }))

beforeEach(() => localStorage.clear())

describe('MarketplacePage large agent picker', () => {
  it('reveals the remaining agents after the first page', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /publish to marketplace/i }))
    const dialog = screen.getByRole('dialog', { name: /publish agent to marketplace/i })

    expect(within(dialog).getByText('24 of 30 shown')).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Show 6 more' }))

    expect(within(dialog).getByText('30 of 30 shown')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: /Show \d+ more/ })).not.toBeInTheDocument()
  })
})
