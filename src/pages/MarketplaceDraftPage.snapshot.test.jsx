import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: false }),
}))

vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => (
    <div>
      runner:{agent.model}:{agent.inputs.length}
    </div>
  ),
}))

import MarketplaceDraftPage from './MarketplaceDraftPage'

const DRAFTS_KEY = 'oa_marketplace_drafts'

beforeEach(() => {
  localStorage.clear()
})

describe('MarketplaceDraftPage snapshot fallback', () => {
  it('runs a draft from its snapshot when the source agent is gone', () => {
    localStorage.setItem(
      DRAFTS_KEY,
      JSON.stringify([
        {
          id: 'd1',
          sourceListingId: 'mkt_1',
          name: 'Imported snapshot',
          description: '',
          tags: [],
          config: {
            baseAgentId: 'removed-agent',
            provider: 'openai',
            systemPrompt: 'snapshot prompt',
            outputType: 'text',
            agentSnapshot: {
              id: 'removed-agent',
              name: 'Original Agent',
              provider: 'openai',
              defaultProvider: 'openai',
              model: 'gpt-4o',
              inputs: [{ id: 'text', type: 'textarea' }],
              systemPrompt: 'snapshot prompt',
              outputType: 'text',
            },
          },
          pendingCredentialFields: [],
          readyToRun: true,
          importedAt: '',
        },
      ])
    )

    render(
      <MemoryRouter initialEntries={['/marketplace/drafts/d1']}>
        <Routes>
          <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('runner:gpt-4o:1')).toBeInTheDocument()
    expect(screen.queryByText('This draft cannot run')).not.toBeInTheDocument()
  })
})
