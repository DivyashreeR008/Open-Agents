import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import BattleModeSetup from './BattleModeSetup'

const agentState = vi.hoisted(() => ({
  agents: [],
  loading: false,
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: agentState.agents, loading: agentState.loading }),
}))

function ArenaProbe() {
  const location = useLocation()
  return (
    <div>
      Arena: {location.state?.agent?.name} key={location.state?.apiKeys?.openai}
    </div>
  )
}

function renderSetup() {
  return render(
    <MemoryRouter initialEntries={['/battle/setup']}>
      <Routes>
        <Route path="/battle/setup" element={<BattleModeSetup />} />
        <Route path="/battle/arena" element={<ArenaProbe />} />
        <Route path="/battle" element={<div>battle landing</div>} />
      </Routes>
    </MemoryRouter>
  )
}

const catalog = [
  {
    id: 'seo',
    name: 'SEO Writer',
    description: 'Improves search ranking',
    category: 'Marketing',
    inputs: [],
  },
  {
    id: 'docker',
    name: 'Docker Helper',
    description: 'Container expert',
    category: 'Engineering',
    inputs: [],
  },
]

beforeEach(() => {
  agentState.agents = catalog
  agentState.loading = false
  localStorage.clear()
})

describe('BattleModeSetup filtering and selection', () => {
  it('filters by category and description, clears to the full list, and reports no matches', () => {
    renderSetup()

    const search = screen.getByLabelText('Search agents')
    expect(screen.getByRole('button', { name: /SEO Writer/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Docker Helper/ })).toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'MARKETING' } })
    expect(screen.getByRole('button', { name: /SEO Writer/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Docker Helper/ })).not.toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'container' } })
    expect(screen.getByRole('button', { name: /Docker Helper/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /SEO Writer/ })).not.toBeInTheDocument()

    fireEvent.change(search, { target: { value: 'no-such-agent' } })
    expect(screen.getByText('No agents found for "no-such-agent"')).toBeInTheDocument()

    fireEvent.change(search, { target: { value: '' } })
    expect(screen.getByRole('button', { name: /SEO Writer/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Docker Helper/ })).toBeInTheDocument()
  })

  it('prefills defaults and only starts when a required input and a non-blank key are present', () => {
    agentState.agents = [
      {
        id: 'writer',
        name: 'SEO Writer',
        description: 'Improves search ranking',
        category: 'Marketing',
        inputs: [
          {
            id: 'topic',
            label: 'Topic',
            type: 'text',
            required: true,
            defaultValue: 'Default topic',
          },
        ],
      },
    ]
    renderSetup()

    fireEvent.click(screen.getByRole('button', { name: /SEO Writer/ }))

    expect(screen.getByRole('heading', { name: 'Configure Battle' })).toBeInTheDocument()
    expect(screen.getByText('Setting up SEO Writer')).toBeInTheDocument()
    expect(screen.getByLabelText('Topic')).toHaveValue('Default topic')

    const start = screen.getByRole('button', { name: 'Add one provider key to start' })
    expect(start).toBeDisabled()

    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: '   ' },
    })
    expect(screen.getByRole('button', { name: 'Add one provider key to start' })).toBeDisabled()

    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: 'sk-live-key' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start Battle' }))

    expect(screen.getByText(/Arena: SEO Writer key=sk-live-key/)).toBeInTheDocument()
  })

  it('accepts the text limit exactly and rejects one character past it', () => {
    agentState.agents = [
      {
        id: 'prompt-agent',
        name: 'Prompt Agent',
        description: 'Exercises the limit',
        category: 'Engineering',
        inputs: [{ id: 'prompt', label: 'Prompt', type: 'text', required: true }],
      },
    ]
    renderSetup()

    fireEvent.click(screen.getByRole('button', { name: /Prompt Agent/ }))
    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: 'sk-live-key' },
    })

    fireEvent.change(screen.getByLabelText('Prompt'), {
      target: { value: 'a'.repeat(2000) },
    })
    expect(screen.getByRole('button', { name: 'Start Battle' })).toBeEnabled()

    fireEvent.change(screen.getByLabelText('Prompt'), {
      target: { value: 'a'.repeat(2001) },
    })
    expect(
      screen.getByText('Prompt exceeds maximum length (2001/2000 characters)')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Complete required agent inputs' })).toBeDisabled()
  })

  it('toggles key visibility per provider and returns to agent selection', () => {
    agentState.agents = [catalog[1]]
    renderSetup()

    fireEvent.click(screen.getByRole('button', { name: /Docker Helper/ }))
    const openAiKey = screen.getByLabelText('OpenAI API Key')
    expect(openAiKey).toHaveAttribute('type', 'password')
    expect(screen.getAllByRole('button', { name: 'Show key' })).toHaveLength(4)

    fireEvent.click(screen.getAllByRole('button', { name: 'Show key' })[0])
    expect(openAiKey).toHaveAttribute('type', 'text')
    expect(screen.getAllByRole('button', { name: 'Hide key' })).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: 'Hide key' }))
    expect(openAiKey).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByRole('button', { name: 'Back to Agent Selection' }))
    expect(screen.getByRole('heading', { name: 'Pick Your Agent' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search agents')).toBeInTheDocument()
  })
})
