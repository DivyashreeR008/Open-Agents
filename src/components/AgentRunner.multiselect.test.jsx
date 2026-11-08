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
  id: 'multi-agent',
  name: 'Multi Agent',
  description: 'Exercises multiselect',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [
    { id: 'brief', label: 'Brief', type: 'text', required: true },
    { id: 'channels', label: 'Channels', type: 'multiselect', options: ['email', 'slack', 'sms'] },
  ],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

describe('AgentRunner multiselect input', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-multi'))
    provider.streamAgent.mockReset()
    provider.streamAgent.mockResolvedValue({ content: 'queued', duration: 2 })
  })

  it('toggles options and joins the selected values into the user message', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: 'email' }))
    fireEvent.click(screen.getByRole('button', { name: 'slack' }))
    expect(screen.getByRole('button', { name: /email/ })).toHaveTextContent('✓')
    expect(screen.getByRole('button', { name: /slack/ })).toHaveTextContent('✓')
    expect(screen.getByRole('button', { name: 'sms' })).not.toHaveTextContent('✓')

    await user.type(screen.getByLabelText('Brief'), 'Launch update')
    const run = screen.getByRole('button', { name: /run agent/i })
    await waitFor(() => expect(run).toBeEnabled())
    await user.click(run)

    await waitFor(() => expect(provider.streamAgent).toHaveBeenCalledTimes(1))
    expect(provider.streamAgent.mock.calls[0][0].userMessage).toBe(
      'Brief: Launch update\n\nChannels: email, slack'
    )

    fireEvent.click(screen.getByRole('button', { name: /email/ }))
    expect(screen.getByRole('button', { name: 'email' })).not.toHaveTextContent('✓')
    expect(screen.getByRole('button', { name: /slack/ })).toHaveTextContent('✓')
  })
})
