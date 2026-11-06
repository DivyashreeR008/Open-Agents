import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'debate-agent',
  name: 'Debate Agent',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Be rigorous and cite evidence.',
  inputs: [
    { id: 'topic', label: 'Topic' },
    { id: 'notes', label: 'Notes' },
  ],
}

const apiKeys = { openai: 'sk-o', anthropic: 'sk-a', gemini: 'sk-g', openrouter: 'sk-r' }

function setup() {
  return render(
    <MemoryRouter
      initialEntries={[{
        pathname: '/battle/arena',
        state: { agent, inputs: { topic: 'AI safety', notes: '' }, apiKeys },
      }]}
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
    const promise = new Promise((res, rej) => { resolve = res; reject = rej })
    pending.push({ provider, resolve, reject })
    return promise
  })
  return pending
}

async function finishAll(pending) {
  await waitFor(() => expect(pending).toHaveLength(4))
  await act(async () => {
    for (const call of pending) {
      call.resolve({ content: `${call.provider} answer`, duration: 1200 })
    }
  })
  await waitFor(() => expect(screen.getAllByRole('button', { name: 'Pick Winner' })).toHaveLength(4))
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  delete navigator.clipboard
  vi.restoreAllMocks()
})

describe('BattleModeArena prompt comparison', () => {
  it('shows placeholders until prompts arrive and then shows every prompt', async () => {
    const pending = deferredRun()
    setup()
    expect(screen.queryByText('System Prompt')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))
    expect(screen.getAllByText('System Prompt')).toHaveLength(4)

    await finishAll(pending)
    expect(screen.getAllByText('Be rigorous and cite evidence.')).toHaveLength(4)
    expect(screen.getAllByText('Topic: AI safety')).toHaveLength(4)
    expect(screen.getAllByText('System Prompt')).toHaveLength(4)
    expect(screen.getAllByText('User Prompt')).toHaveLength(4)

    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))
    expect(screen.queryByText('System Prompt')).not.toBeInTheDocument()
  })

  it('shows prompt placeholders for a provider without configured prompt data', async () => {
    runAgent.mockResolvedValue({ content: 'answer', duration: 1000 })
    render(
      <MemoryRouter
        initialEntries={[{
          pathname: '/battle/arena',
          state: { agent, inputs: { topic: 'AI safety' }, apiKeys: { ...apiKeys, openai: '' } },
        }]}
      >
        <BattleModeArena />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))
    expect(screen.getAllByText('Prompt not available yet.')).toHaveLength(2)
    expect(screen.getAllByText('System Prompt')).toHaveLength(4)
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Pick Winner' })).toHaveLength(3))
  })

  it('copies the exact system and user prompts for the selected provider', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const pending = deferredRun()
    setup()
    await finishAll(pending)
    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))

    fireEvent.click(screen.getByRole('button', { name: 'Copy OpenAI prompt' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(writeText).toHaveBeenCalledWith(
      'System Prompt: Be rigorous and cite evidence.\n\nUser Prompt: Topic: AI safety'
    )
    expect(screen.getByRole('status')).toHaveTextContent('OpenAI prompt copied to clipboard.')
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })

  it('announces a blocked clipboard and never shows a false success', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const pending = deferredRun()
    setup()
    await finishAll(pending)
    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))

    fireEvent.click(screen.getByRole('button', { name: 'Copy Claude prompt' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/Unable to copy the Claude prompt/))
    expect(screen.queryByText('Copied')).not.toBeInTheDocument()
  })
})
