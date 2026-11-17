import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const mocks = vi.hoisted(() => ({ navigate: vi.fn() }))

vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }))
vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      { id: 'writer', name: 'Writer', icon: 'PenLine' },
      { id: 'reviewer', name: 'Reviewer', icon: 'Eye' },
    ],
  }),
}))
vi.mock('../lib/agentIcons', () => ({
  resolveAgentIcon: () => {
    function TestIcon() {
      return <svg data-testid="chain-icon" />
    }
    return TestIcon
  },
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import SuggestedChainPills from './SuggestedChainPills'

describe('SuggestedChainPills button safety', () => {
  it('uses explicit non-submit buttons that navigate without submitting a form', () => {
    const onSubmit = vi.fn()

    render(
      <form onSubmit={onSubmit}>
        <SuggestedChainPills
          agent={{ id: 'reviewer', name: 'Reviewer', suggestedChainFrom: ['writer'] }}
        />
      </form>
    )

    const pill = screen.getByRole('button', { name: 'Writer' })
    expect(pill).toHaveAttribute('type', 'button')

    fireEvent.click(pill)

    expect(onSubmit).not.toHaveBeenCalled()
    expect(mocks.navigate).toHaveBeenCalledWith('/workflows/build', {
      state: { preselectedAgents: ['writer', 'reviewer'] },
    })
  })
})
