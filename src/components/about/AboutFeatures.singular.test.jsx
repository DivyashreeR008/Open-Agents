import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const state = vi.hoisted(() => ({ agents: [], catalogSize: 0 }))

vi.mock('../../lib/useAgents', () => ({
  useAgents: () => ({ agents: state.agents, catalogSize: state.catalogSize }),
}))

import AboutFeatures from './AboutFeatures'

describe('AboutFeatures count grammar', () => {
  beforeEach(() => {
    state.agents = []
    state.catalogSize = 0
  })

  it('uses a singular feature title when exactly one agent is available', () => {
    state.agents = [{ id: 'only-agent' }]
    state.catalogSize = 500
    render(<AboutFeatures />)

    expect(
      screen.getByRole('heading', { level: 3, name: '1 Specialized AI Agent' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 3, name: '1 Specialized AI Agents' })
    ).not.toBeInTheDocument()
  })

  it('keeps the plural title when the catalogue is larger', () => {
    state.catalogSize = 500
    render(<AboutFeatures />)

    expect(
      screen.getByRole('heading', { level: 3, name: '500 Specialized AI Agents' })
    ).toBeInTheDocument()
  })
})
