import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'edge-agent',
  name: 'Edge Agent',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Be precise.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

const apiKeys = {
  openai: 'sk-o',
  anthropic: 'sk-a',
  gemini: 'sk-g',
  openrouter: 'sk-r',
}

function renderArena(state = { agent, inputs: { topic: 'AI safety' }, apiKeys }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/battle/arena', state }]}>
      <Routes>
        <Route path="/battle/arena" element={<BattleModeArena />} />
        <Route path="/battle/setup" element={<div>Battle setup</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  delete navigator.clipboard
  vi.restoreAllMocks()
})

describe('BattleModeArena navigation and prompt copying', () => {
  it('returns to setup from the arena header', async () => {
    runAgent.mockReturnValue(new Promise(() => {}))
    renderArena()

    fireEvent.click(screen.getByRole('button', { name: /Back to Setup/i }))

    expect(await screen.findByText('Battle setup')).toBeInTheDocument()
  })

  it('copies Gemini and OpenRouter prompts with matching announcements', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    runAgent.mockResolvedValue({ content: 'answer', duration: 1000 })
    renderArena()

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Pick Winner' })).toHaveLength(4)
    )
    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))

    fireEvent.click(screen.getByRole('button', { name: 'Copy Gemini prompt' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(writeText).toHaveBeenLastCalledWith(
      'System Prompt: Be precise.\n\nUser Prompt: Topic: AI safety'
    )
    expect(screen.getByRole('status')).toHaveTextContent('Gemini prompt copied to clipboard.')

    fireEvent.click(screen.getByRole('button', { name: 'Copy OpenRouter prompt' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2))
    expect(screen.getByRole('status')).toHaveTextContent('OpenRouter prompt copied to clipboard.')
  })

  it('aborts every in-flight request when the arena unmounts', async () => {
    const signals = []
    runAgent.mockImplementation((_request, options) => {
      signals.push(options.signal)
      return new Promise(() => {})
    })

    const { unmount } = renderArena()
    await waitFor(() => expect(signals).toHaveLength(4))
    expect(signals.every((signal) => signal.aborted)).toBe(false)

    unmount()

    expect(signals.every((signal) => signal.aborted)).toBe(true)
  })
})
