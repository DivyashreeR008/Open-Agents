import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'missing-claude-prompt',
  name: 'Missing Claude Prompt',
  category: 'Research',
  outputType: 'text',
  systemPrompt: 'Be precise.',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('BattleModeArena missing Claude prompt data', () => {
  it('shows both placeholders for a provider that never ran', async () => {
    runAgent.mockResolvedValue({ content: 'answer', duration: 1000 })

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/battle/arena',
            state: {
              agent,
              inputs: { topic: 'AI safety' },
              apiKeys: { openai: 'sk-o', anthropic: '', gemini: 'sk-g', openrouter: 'sk-r' },
            },
          },
        ]}
      >
        <BattleModeArena />
      </MemoryRouter>
    )

    await waitFor(() =>
      expect(screen.getAllByRole('button', { name: 'Pick Winner' })).toHaveLength(3)
    )
    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))

    expect(screen.getAllByText('Prompt not available yet.')).toHaveLength(2)
  })
})
