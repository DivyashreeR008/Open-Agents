import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({
  agents: [{ id: 'code-reviewer', name: 'Code Reviewer', icon: 'Code' }],
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents }),
}))

import SuggestedChainPills from './SuggestedChainPills'

function renderPills(agent) {
  return render(
    <MemoryRouter>
      <SuggestedChainPills agent={agent} />
    </MemoryRouter>
  )
}

describe('SuggestedChainPills malformed definitions', () => {
  beforeEach(() => {
    state.agents = [{ id: 'code-reviewer', name: 'Code Reviewer', icon: 'Code' }]
  })

  it('ignores a string chain value instead of calling map on it', () => {
    const { container } = renderPills({
      id: 'writer',
      name: 'Writer',
      suggestedChainFrom: 'code-reviewer',
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('ignores a missing agent record', () => {
    const { container } = renderPills(undefined)

    expect(container).toBeEmptyDOMElement()
  })

  it('still renders a valid chain', () => {
    const { getByRole } = renderPills({
      id: 'writer',
      name: 'Writer',
      suggestedChainFrom: ['code-reviewer'],
    })

    expect(getByRole('button', { name: 'Code Reviewer' })).toBeInTheDocument()
  })
})
