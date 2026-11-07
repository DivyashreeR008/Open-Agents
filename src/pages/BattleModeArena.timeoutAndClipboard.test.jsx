import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'timeout-agent',
  name: 'Timeout Agent',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Be patient.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

const apiKeys = { openai: 'sk-o', anthropic: 'sk-a', gemini: 'sk-g', openrouter: 'sk-r' }

function renderArena() {
  return render(
    <MemoryRouter
      initialEntries={[
        { pathname: '/battle/arena', state: { agent, inputs: { topic: 'AI safety' }, apiKeys } },
      ]}
    >
      <Routes>
        <Route path="/battle/arena" element={<BattleModeArena />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  delete navigator.clipboard
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('BattleModeArena timeout and clipboard guards', () => {
  it('aborts every provider request when the timeout timer fires', () => {
    vi.useFakeTimers()
    const signals = []
    runAgent.mockImplementation((_request, options) => {
      signals.push(options.signal)
      return new Promise(() => {})
    })

    renderArena()
    expect(signals).toHaveLength(4)
    expect(signals.every((signal) => signal.aborted)).toBe(false)

    act(() => vi.advanceTimersByTime(60000))

    expect(signals.every((signal) => signal.aborted)).toBe(true)
  })

  it('announces a clipboard failure when the browser exposes no writeText API', async () => {
    runAgent.mockResolvedValue({ content: 'answer', duration: 1000 })
    renderArena()
    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Pick Winner' })).toHaveLength(4)
    )

    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy OpenAI prompt' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Unable to copy the OpenAI prompt. Please try again.'
    )
  })
})
