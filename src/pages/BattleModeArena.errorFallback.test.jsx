import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('../lib/useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))

import { runAgent } from '../lib/llmAdapter'
import BattleModeArena from './BattleModeArena'

const agent = {
  id: 'fallback-agent',
  name: 'Fallback Agent',
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

function renderArena() {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/battle/arena',
          state: { agent, inputs: { topic: 'AI safety' }, apiKeys },
        },
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
  vi.restoreAllMocks()
})

describe('BattleModeArena non-Error rejection fallback', () => {
  it('shows a generic error in every panel when the rejection has no message', async () => {
    runAgent.mockRejectedValue('network down')

    renderArena()

    const errors = await screen.findAllByText('An unknown error occurred')
    expect(errors).toHaveLength(4)
    await waitFor(() =>
      expect(screen.queryAllByRole('button', { name: 'Pick Winner' })).toHaveLength(0)
    )
  })
})
