import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  loadAllAgents: vi.fn(),
}))

vi.mock('../agents/registry', () => ({
  AGENT_COUNT: 2,
  loadAllAgents: mocks.loadAllAgents,
}))

import { AgentsProvider, useAgents } from './useAgents'

function Probe() {
  const { agents, loading, error, reloadAgents, catalogSize } = useAgents()
  return (
    <div>
      <span>loading:{String(loading)}</span>
      <span>count:{agents.length}</span>
      <span>catalog:{catalogSize}</span>
      <span>error:{error ? error.message : 'none'}</span>
      <button onClick={reloadAgents}>reload</button>
    </div>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  mocks.loadAllAgents.mockReset()
})

describe('AgentsProvider edge behavior', () => {
  it('surfaces a failed catalog load and recovers on an explicit reload', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mocks.loadAllAgents
      .mockRejectedValueOnce(new Error('registry offline'))
      .mockResolvedValueOnce([{ id: 'a1' }])

    render(
      <AgentsProvider>
        <Probe />
      </AgentsProvider>
    )

    expect(await screen.findByText('error:registry offline')).toBeInTheDocument()
    expect(screen.getByText('loading:false')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'reload' }))

    expect(await screen.findByText('count:1')).toBeInTheDocument()
    expect(screen.getByText('error:none')).toBeInTheDocument()
    expect(screen.getByText('catalog:2')).toBeInTheDocument()
  })

  it('rejects useAgents outside a provider instead of returning an empty catalog', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useAgents())).toThrow(
      'useAgents must be used within an AgentsProvider'
    )
  })
})
