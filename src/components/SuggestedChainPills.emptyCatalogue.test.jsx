import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = vi.hoisted(() => ({ agents: [] }))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents }),
}))

import SuggestedChainPills from './SuggestedChainPills'

beforeEach(() => {
  state.agents = []
})

describe('SuggestedChainPills empty catalogue', () => {
  it('renders nothing when the catalogue has not loaded yet', () => {
    const { container } = render(
      <MemoryRouter>
        <SuggestedChainPills
          agent={{ id: 'writer', name: 'Writer', suggestedChainFrom: ['researcher'] }}
        />
      </MemoryRouter>
    )

    expect(container).toBeEmptyDOMElement()
  })
})
