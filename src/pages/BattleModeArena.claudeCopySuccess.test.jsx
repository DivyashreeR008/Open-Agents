import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'claude-copy-agent',
  name: 'Claude Copy Agent',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Be precise.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

const apiKeys = { openai: 'sk-o', anthropic: 'sk-a', gemini: 'sk-g', openrouter: 'sk-r' }

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  delete navigator.clipboard
  vi.restoreAllMocks()
})

describe('BattleModeArena Claude prompt copy', () => {
  it('shows the copied state and announcement after copying the Claude prompt', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    runAgent.mockResolvedValue({ content: 'answer', duration: 1000 })

    render(
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

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Pick Winner' })).toHaveLength(4)
    )
    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy Claude prompt' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(screen.getByRole('status')).toHaveTextContent('Claude prompt copied to clipboard.')
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })
})
