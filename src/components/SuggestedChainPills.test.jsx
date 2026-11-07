import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

const state = vi.hoisted(() => ({
  agents: [],
  navigate: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents }),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => state.navigate,
}))

const { default: SuggestedChainPills } = await import('./SuggestedChainPills')

const writer = { id: 'writer', name: 'Technical Writer', icon: 'PenLine' }
const tester = { id: 'tester', name: 'Test Planner', icon: 'FlaskConical' }
const reviewer = {
  id: 'reviewer',
  name: 'Code Reviewer',
  icon: 'Code',
  suggestedChainFrom: ['writer', 'missing', 'tester'],
}

describe('SuggestedChainPills', () => {
  beforeEach(() => {
    state.agents = [writer, tester]
    state.navigate.mockReset()
  })

  it('renders nothing when the agent has no suggested chain', () => {
    const { container } = render(
      <SuggestedChainPills agent={{ ...reviewer, suggestedChainFrom: [] }} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when no suggested predecessor exists in the catalogue', () => {
    const { container } = render(
      <SuggestedChainPills
        agent={{ ...reviewer, suggestedChainFrom: ['missing', 'also-missing'] }}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders only known predecessors in their declared order', () => {
    render(<SuggestedChainPills agent={reviewer} />)

    expect(screen.getByText('Works well after')).toBeInTheDocument()
    const pills = screen.getAllByRole('button')
    expect(pills.map((pill) => pill.textContent)).toEqual(['Technical Writer', 'Test Planner'])
    expect(screen.queryByText('missing')).not.toBeInTheDocument()
  })

  it('navigates to the builder with the predecessor first and current agent second', () => {
    render(<SuggestedChainPills agent={reviewer} />)

    fireEvent.click(screen.getByRole('button', { name: 'Technical Writer' }))

    expect(state.navigate).toHaveBeenCalledWith('/workflows/build', {
      state: {
        preselectedAgents: ['writer', 'reviewer'],
      },
    })
  })

  it('names both agents in each pill title', () => {
    render(<SuggestedChainPills agent={reviewer} />)

    expect(screen.getByRole('button', { name: 'Technical Writer' })).toHaveAttribute(
      'title',
      'Start a workflow: Technical Writer \u2192 Code Reviewer'
    )
  })
})
