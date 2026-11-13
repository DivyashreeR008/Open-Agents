import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import BattleModeSetup from './BattleModeSetup'
import { getGlobalKeys, saveGlobalKeys } from '../lib/globalKeys'

const agentState = vi.hoisted(() => ({ agents: [], loading: false }))

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
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  agentState.agents = [
    {
      id: 'writer',
      name: 'SEO Writer',
      description: 'Improves search ranking',
      category: 'Marketing',
      inputs: [],
    },
  ]
  agentState.loading = false
})

describe('BattleModeSetup saved credentials', () => {
  it('prefills saved keys, marks them, and reports which providers are ready', () => {
    saveGlobalKeys({ openai: 'sk-saved-openai', anthropic: 'sk-ant-saved-anthropic' })
    renderSetup()

    fireEvent.click(screen.getByRole('button', { name: /SEO Writer/ }))

    expect(screen.getByLabelText('OpenAI API Key')).toHaveValue('sk-saved-openai')
    expect(screen.getByLabelText('Anthropic API Key')).toHaveValue('sk-ant-saved-anthropic')
    expect(screen.getAllByText('Saved')).toHaveLength(2)
    expect(screen.getByRole('status')).toHaveTextContent('Ready to run: OpenAI, Anthropic')
    expect(screen.getByRole('button', { name: 'Start Battle' })).toBeEnabled()
  })

  it('allows a battle-only override without changing the stored key', () => {
    saveGlobalKeys({ openai: 'sk-saved-openai' })
    renderSetup()

    fireEvent.click(screen.getByRole('button', { name: /SEO Writer/ }))
    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: 'sk-battle-only' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Start Battle' }))

    expect(screen.getByText(/Arena: SEO Writer key=sk-battle-only/)).toBeInTheDocument()
    expect(getGlobalKeys().openai).toBe('sk-saved-openai')
  })

  it('does not mark optional provider fields as required and names format errors', () => {
    renderSetup()

    fireEvent.click(screen.getByRole('button', { name: /SEO Writer/ }))

    expect(screen.getByText('OpenAI API Key')).not.toHaveTextContent('*')
    expect(screen.getByRole('button', { name: 'Add one provider key to start' })).toBeDisabled()

    fireEvent.change(screen.getByLabelText('OpenAI API Key'), {
      target: { value: 'sk-ant-mismatched' },
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'OpenAI API Key: This looks like an Anthropic key'
    )
    expect(screen.getByRole('button', { name: 'Fix provider key errors' })).toBeDisabled()
  })
})
