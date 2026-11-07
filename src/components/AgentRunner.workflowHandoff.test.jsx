import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ streamAgent: vi.fn() }))

vi.mock('../lib/llmAdapter', () => ({ streamAgent: provider.streamAgent }))
vi.mock('./ApiKeyBar', () => ({ default: () => null }))
vi.mock('./ApiKeyInfo', () => ({ default: () => null }))
vi.mock('./OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('./VoiceInput', () => ({ default: () => null }))
vi.mock('./RunRating', () => ({ default: () => null }))
vi.mock('./SuggestedChainPills', () => ({ default: () => null }))
vi.mock('./CostEstimator', () => ({ default: () => null }))
vi.mock('./TokenCounter', () => ({ default: () => null }))
vi.mock('./BatchModeRunner', () => ({ default: () => null }))
vi.mock('./AgentPreviewPanel', () => ({ default: () => null }))
vi.mock('./PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'handoff-agent',
  name: 'Handoff Agent',
  description: 'Sends output to the workflow builder',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [{ id: 'brief', label: 'Brief', type: 'text', required: true }],
}

function LocationProbe() {
  const location = useLocation()
  return (
    <pre data-testid="location">
      {JSON.stringify({ pathname: location.pathname, state: location.state })}
    </pre>
  )
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

describe('AgentRunner workflow handoff', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-handoff'))
    provider.streamAgent.mockReset()
    provider.streamAgent.mockResolvedValue({ content: 'handoff output', duration: 5 })
  })

  it('opens the workflow builder with the agent and output prefilled', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AgentRunner agent={agent} />} />
          <Route path="/workflows/build" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Brief'), 'Build a launch workflow')
    const run = screen.getByRole('button', { name: /run agent/i })
    await waitFor(() => expect(run).toBeEnabled())
    await user.click(run)
    await screen.findByText('handoff output')

    await user.click(screen.getByRole('button', { name: /send output to workflow builder/i }))

    expect(JSON.parse(screen.getByTestId('location').textContent)).toEqual({
      pathname: '/workflows/build',
      state: {
        preselectedAgents: ['handoff-agent'],
        preFilledOutput: 'handoff output',
      },
    })
  })
})
