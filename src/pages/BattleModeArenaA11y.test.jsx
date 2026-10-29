import { describe, it, expect, vi } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../lib/llmAdapter', () => ({
  runAgent: vi.fn(() => new Promise(() => {})),
}))

import BattleModeArena, { PROVIDERS } from './BattleModeArena'

const agent = {
  id: 'test-agent',
  name: 'Test Agent',
  category: 'Test',
  provider: 'any',
  outputType: 'text',
  systemPrompt: 'You are a test agent.',
  inputs: [],
}

function setup() {
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
}

describe('BattleMode arena answer regions', () => {
  it('exposes one labeled region per provider in provider order', () => {
    setup()
    const group = screen.getByRole('group', { name: 'Model answers' })
    const regions = within(group).getAllByRole('region')
    expect(regions).toHaveLength(PROVIDERS.length)
    PROVIDERS.forEach((p, i) => {
      expect(regions[i]).toBe(screen.getByRole('region', { name: p.label }))
      expect(regions[i]).toContainElement(screen.getByText(`${p.label} is generating...`))
    })
  })

  it('moves focus between regions with arrow, Home and End keys', () => {
    setup()
    const regions = PROVIDERS.map((p) => screen.getByRole('region', { name: p.label }))
    regions[0].focus()
    fireEvent.keyDown(regions[0], { key: 'ArrowRight' })
    expect(regions[1]).toHaveFocus()
    fireEvent.keyDown(regions[1], { key: 'End' })
    expect(regions[3]).toHaveFocus()
    fireEvent.keyDown(regions[3], { key: 'ArrowRight' })
    expect(regions[3]).toHaveFocus()
    fireEvent.keyDown(regions[3], { key: 'ArrowLeft' })
    expect(regions[2]).toHaveFocus()
    fireEvent.keyDown(regions[2], { key: 'Home' })
    expect(regions[0]).toHaveFocus()
  })
})
