import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
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
  id: 'required-multi',
  name: 'Required Multi',
  description: 'Requires a multiselect choice',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [
    {
      id: 'channels',
      label: 'Channels',
      type: 'multiselect',
      required: true,
      options: ['email', 'slack'],
    },
  ],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  sessionStorage.setItem('oa_apikey_openai', wrap('sk-multi'))
  provider.streamAgent.mockReset()
  provider.streamAgent.mockResolvedValue({ content: 'sent', duration: 1 })
})

describe('AgentRunner required multiselect', () => {
  it('enables the run button only after a required multiselect value is chosen', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    const run = screen.getByRole('button', { name: /run agent/i })
    expect(run).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'email' }))
    await waitFor(() => expect(run).toBeEnabled())
    await user.click(run)

    await waitFor(() => expect(provider.streamAgent).toHaveBeenCalledTimes(1))
    expect(provider.streamAgent.mock.calls[0][0].userMessage).toBe('Channels: email')
  })
})
