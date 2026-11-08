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
  id: 'version-agent',
  name: 'Version Agent',
  description: 'Keeps input snapshots',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [{ id: 'brief', label: 'Brief', type: 'text', required: true }],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

describe('AgentRunner version history', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    sessionStorage.setItem('oa_apikey_openai', wrap('sk-version'))
    provider.streamAgent.mockReset()
  })

  it('numbers each run and restores an earlier input snapshot', async () => {
    provider.streamAgent
      .mockResolvedValueOnce({ content: 'first output', duration: 1 })
      .mockResolvedValueOnce({ content: 'second output', duration: 2 })
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    expect(screen.getByText(/no versions saved yet/i)).toBeInTheDocument()
    const input = screen.getByLabelText('Brief')
    const run = screen.getByRole('button', { name: /run agent/i })

    await user.type(input, 'first value')
    await waitFor(() => expect(run).toBeEnabled())
    await user.click(run)
    await screen.findByText('first output')

    fireEvent.change(input, { target: { value: 'second value' } })
    await user.click(run)
    await screen.findByText('second output')

    const versions = screen.getAllByText(/^Version \d+$/)
    expect(versions.map((version) => version.textContent)).toEqual(['Version 2', 'Version 1'])

    const restoreButtons = screen.getAllByRole('button', { name: /restore/i })
    fireEvent.click(restoreButtons[1])

    expect(input).toHaveValue('first value')
  })
})
