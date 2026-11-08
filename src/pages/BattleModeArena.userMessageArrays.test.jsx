import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ runAgent: vi.fn() }))

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'array-agent',
  name: 'Array Agent',
  category: 'Testing',
  outputType: 'text',
  systemPrompt: 'Use every selected value.',
  inputs: [
    { id: 'tags', label: 'Tags' },
    { id: 'empty', label: 'Empty' },
  ],
}

beforeEach(() => {
  mocks.runAgent.mockReset()
  mocks.runAgent.mockResolvedValue({ content: 'Answer', duration: 100 })
})

describe('BattleModeArena array input formatting', () => {
  it('joins selected values and omits an empty selection from the user prompt', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/battle/arena',
            state: {
              agent,
              inputs: { tags: ['alpha', 'beta'], empty: [] },
              apiKeys: { openai: 'a', anthropic: 'b', gemini: 'c', openrouter: 'd' },
            },
          },
        ]}
      >
        <BattleModeArena />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Prompt Comparison Viewer/ }))
    await waitFor(() => expect(screen.getAllByText('Tags: alpha, beta')).toHaveLength(4))
    expect(screen.queryByText(/Empty:/)).not.toBeInTheDocument()
  })
})
