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
vi.mock('./BatchModeRunner', () => ({ default: () => <div>Batch runner</div> }))
vi.mock('./AgentPreviewPanel', () => ({ default: () => null }))
vi.mock('./PromptHistoryPanel', () => ({ default: () => null }))
vi.mock('./ScheduleAgentModal', () => ({ default: () => null }))

import AgentRunner from './AgentRunner'

const agent = {
  id: 'shortcut-agent',
  name: 'Shortcut Agent',
  description: 'Exercises Control+Enter',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [{ id: 'brief', label: 'Brief', type: 'textarea', required: true }],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

const renderRunner = () =>
  render(
    <MemoryRouter>
      <AgentRunner agent={agent} />
    </MemoryRouter>
  )

describe('AgentRunner Control+Enter shortcut', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-shortcut'))
    provider.streamAgent.mockReset()
    provider.streamAgent.mockResolvedValue({ content: 'shortcut output', duration: 2 })
  })

  it('starts a run when the required input and key are present', async () => {
    const user = userEvent.setup()
    renderRunner()
    await user.type(screen.getByLabelText('Brief'), 'Keyboard prompt')
    await waitFor(() => expect(screen.getByRole('button', { name: /run agent/i })).toBeEnabled())

    fireEvent.keyDown(window, { key: 'Enter', ctrlKey: true })

    await waitFor(() => expect(provider.streamAgent).toHaveBeenCalledTimes(1))
    expect(provider.streamAgent.mock.calls[0][0].userMessage).toBe('Brief: Keyboard prompt')
  })

  it('does nothing while the form is incomplete', async () => {
    renderRunner()
    await waitFor(() => expect(screen.getByRole('button', { name: /run agent/i })).toBeDisabled())

    fireEvent.keyDown(window, { key: 'Enter', ctrlKey: true })

    expect(provider.streamAgent).not.toHaveBeenCalled()
  })

  it('does nothing in batch mode', async () => {
    const user = userEvent.setup()
    renderRunner()
    await user.type(screen.getByLabelText('Brief'), 'Batch prompt')
    await user.click(screen.getByRole('button', { name: /batch mode/i }))
    expect(screen.getByText('Batch runner')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Enter', ctrlKey: true })

    expect(provider.streamAgent).not.toHaveBeenCalled()
  })
})
