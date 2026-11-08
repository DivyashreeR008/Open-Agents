import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ runAgent: vi.fn() }))

vi.mock('../lib/llmAdapter', () => ({ runAgent: mocks.runAgent }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'scope-agent',
  name: 'Scope Agent',
  category: 'Testing',
  outputType: 'text',
  systemPrompt: 'Reply briefly.',
  inputs: [],
}

beforeEach(() => {
  mocks.runAgent.mockReset()
})

describe('BattleModeArena pane keyboard scope', () => {
  it('ignores arrow keys that originate on a control inside a pane', async () => {
    mocks.runAgent.mockRejectedValue(new Error('Provider unavailable'))

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/battle/arena',
            state: {
              agent,
              inputs: {},
              apiKeys: { openai: 'a', anthropic: 'b', gemini: 'c', openrouter: 'd' },
            },
          },
        ]}
      >
        <BattleModeArena />
      </MemoryRouter>
    )

    const group = screen.getByRole('group', { name: 'Model answers' })
    const openaiRegion = within(group).getAllByRole('region')[0]
    const retry = await within(openaiRegion).findByRole('button', { name: /Retry/i })
    retry.focus()

    fireEvent.keyDown(retry, { key: 'ArrowRight' })

    expect(retry).toHaveFocus()
  })
})
