import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import { recordAnalyticsRun } from '../lib/useAnalytics'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'debate-agent',
  name: 'Debate Agent',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Argue carefully.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

const apiKeys = { openai: 'sk-o', anthropic: 'sk-a', gemini: 'sk-g', openrouter: 'sk-r' }

function setup() {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/battle/arena',
          state: { agent, inputs: { topic: 'AI safety' }, apiKeys },
        },
      ]}
    >
      <BattleModeArena />
    </MemoryRouter>
  )
}

function deferredRun() {
  const pending = []
  runAgent.mockImplementation(({ provider }) => {
    let resolve
    let reject
    const promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })
    pending.push({ provider, resolve, reject })
    return promise
  })
  return pending
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('BattleModeArena progress and retry', () => {
  it('keeps the first finisher badge, labels the rest, records analytics, and retries one panel', async () => {
    const pending = deferredRun()
    setup()
    await waitFor(() => expect(pending).toHaveLength(4))

    const openai = pending.find((call) => call.provider === 'openai')
    await act(async () => {
      openai.resolve({ content: 'OpenAI answer', duration: 2100 })
    })
    expect(await screen.findByText('OpenAI answer')).toBeInTheDocument()
    expect(screen.getByText('First to finish!')).toBeInTheDocument()
    expect(screen.getByText('2.1s')).toBeInTheDocument()
    expect(screen.getAllByText('Still fighting...')).toHaveLength(3)
    expect(recordAnalyticsRun).toHaveBeenCalledTimes(1)
    expect(recordAnalyticsRun).toHaveBeenCalledWith(
      expect.objectContaining({
        agentId: 'debate-agent',
        provider: 'openai',
        model: 'gpt-4o',
        duration: 2100,
      })
    )

    const anthropic = pending.find((call) => call.provider === 'anthropic')
    const gemini = pending.find((call) => call.provider === 'gemini')
    const openrouter = pending.find((call) => call.provider === 'openrouter')
    await act(async () => {
      anthropic.reject(new Error('Claude service is unavailable'))
      gemini.resolve({ content: 'Gemini answer', duration: 3000 })
      openrouter.resolve({ content: 'Router answer', duration: 4000 })
    })
    expect(await screen.findByText('Claude service is unavailable')).toBeInTheDocument()
    expect(screen.getByText('Gemini answer')).toBeInTheDocument()
    expect(screen.getByText('Router answer')).toBeInTheDocument()
    expect(screen.getByText('First to finish!')).toBeInTheDocument()
    expect(recordAnalyticsRun).toHaveBeenCalledTimes(3)

    const claudePane = screen.getByRole('region', { name: 'Claude Sonnet' })
    fireEvent.click(within(claudePane).getByRole('button', { name: 'Retry Claude Sonnet' }))
    expect(runAgent).toHaveBeenCalledTimes(5)
    expect(within(claudePane).getByText('Still fighting...')).toBeInTheDocument()
    expect(within(claudePane).queryByText('Claude service is unavailable')).not.toBeInTheDocument()

    await waitFor(() => expect(pending).toHaveLength(5))
    const retry = pending[4]
    await act(async () => {
      retry.resolve({ content: 'Claude recovered', duration: 800 })
    })
    expect(await screen.findByText('Claude recovered')).toBeInTheDocument()
    expect(screen.getByText('OpenAI answer')).toBeInTheDocument()
    expect(screen.getByText('0.8s')).toBeInTheDocument()
    expect(within(claudePane).getByRole('button', { name: 'Pick Winner' })).toBeInTheDocument()
  })
})
