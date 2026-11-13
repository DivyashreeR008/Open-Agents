import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  runAgent: vi.fn(),
  logAgentRun: vi.fn(),
}))

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../lib/useAgentRunMetrics', () => ({ logAgentRun: mocks.logAgentRun }))

import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'record-agent',
  name: 'Record Agent',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Be concise.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

const apiKeys = { openai: 'sk-o', anthropic: 'sk-a', gemini: 'sk-g', openrouter: 'sk-r' }

function renderArena(keys = apiKeys) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/battle/arena',
          state: { agent, inputs: { topic: 'Metrics' }, apiKeys: keys },
        },
      ]}
    >
      <BattleModeArena />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.logAgentRun.mockResolvedValue({ data: null, error: null })
})

describe('BattleModeArena run recording', () => {
  it('records each completed provider run with its outcome, model, and token count', async () => {
    mocks.runAgent.mockImplementation(({ provider }) => {
      if (provider === 'anthropic') return Promise.reject(new Error('provider unavailable'))
      return Promise.resolve({ content: `${provider} answer`, duration: 1234, tokens: 42 })
    })

    renderArena()

    await waitFor(() => expect(mocks.logAgentRun).toHaveBeenCalledTimes(4))
    expect(await screen.findByText('provider unavailable')).toBeInTheDocument()

    const openai = mocks.logAgentRun.mock.calls
      .map(([run]) => run)
      .find((run) => run.agentRunId.includes(':openai:'))
    expect(openai).toMatchObject({
      model: 'gpt-4o',
      inputTokens: 0,
      outputTokens: 42,
      status: 'success',
      durationMs: 1234,
    })
    expect(openai.agentRunId).toMatch(/^record-agent:openai:/)

    const anthropic = mocks.logAgentRun.mock.calls
      .map(([run]) => run)
      .find((run) => run.agentRunId.includes(':anthropic:'))
    expect(anthropic).toMatchObject({
      model: 'claude-3-5-sonnet-20241022',
      inputTokens: 0,
      outputTokens: 0,
      status: 'failed',
    })
    expect(anthropic.durationMs).toEqual(expect.any(Number))

    expect(
      mocks.logAgentRun.mock.calls.map(([run]) => run.agentRunId.split(':')[1]).sort()
    ).toEqual(['anthropic', 'gemini', 'openai', 'openrouter'])
  })

  it('does not record a run for a provider that was skipped for a missing key', async () => {
    mocks.runAgent.mockResolvedValue({ content: 'answer', duration: 100, tokens: 10 })

    renderArena({ ...apiKeys, anthropic: '   ' })

    await waitFor(() => expect(mocks.logAgentRun).toHaveBeenCalledTimes(3))
    expect(mocks.logAgentRun.mock.calls.map(([run]) => run.agentRunId.split(':')[1])).not.toContain(
      'anthropic'
    )
    expect(
      await screen.findByText(/API key for Claude Sonnet is not configured/)
    ).toBeInTheDocument()
  })
})
