import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
  id: 'late-chunk',
  name: 'Late Chunk',
  description: 'Checks stale stream chunks',
  category: 'Test',
  provider: 'openai',
  icon: 'Bot',
  outputType: 'markdown',
  systemPrompt: 'Test prompt.',
  inputs: [{ id: 'brief', label: 'Brief', type: 'textarea', required: true }],
}

const wrap = (key) => JSON.stringify({ key, expiresAt: Date.now() + 60_000 })

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  sessionStorage.setItem('oa_apikey_openai', wrap('sk-late'))
})

describe('AgentRunner cleared stream chunk', () => {
  it('discards a chunk that arrives after the run was cleared', async () => {
    let emit
    let resolveRun
    provider.streamAgent.mockImplementation(({ onChunk }) => {
      emit = onChunk
      return new Promise((resolve) => {
        resolveRun = resolve
      })
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AgentRunner agent={agent} />
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Brief'), 'hello')
    await user.click(screen.getByRole('button', { name: /run agent/i }))
    await waitFor(() => expect(provider.streamAgent).toHaveBeenCalledTimes(1))

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    act(() => emit('STALE-CHUNK'))
    await act(async () => resolveRun({ content: 'STALE-RESULT', duration: 1 }))

    expect(screen.queryByText('STALE-CHUNK')).not.toBeInTheDocument()
    expect(screen.queryByText('STALE-RESULT')).not.toBeInTheDocument()
  })
})
