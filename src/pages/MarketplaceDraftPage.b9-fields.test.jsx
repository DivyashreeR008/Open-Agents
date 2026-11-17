import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'

const state = vi.hoisted(() => ({
  drafts: {},
  built: null,
  removeResult: true,
}))

vi.mock('../lib/marketplace', () => ({
  getDraft: (id) => state.drafts[id] ?? null,
  buildDraftAgent: (draft) => {
    state.built = draft
    return { id: draft.id, name: draft.name }
  },
  getMissingDraftFields: () => [],
  removeDraft: () => state.removeResult,
}))

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({ agents: [], loading: false }),
}))

vi.mock('../lib/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}))

vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => <div>runner:{agent.name}</div>,
}))

import MarketplaceDraftPage from './MarketplaceDraftPage'

function draft(id, name, fields = ['systemPrompt']) {
  return {
    id,
    name,
    description: '',
    config: {
      systemPrompt: 'publisher value',
      agentSnapshot: { inputs: [{ default: 'publisher default' }] },
      untouched: true,
    },
    pendingCredentialFields: fields,
  }
}

function renderPage(initialId = 'd1') {
  return render(
    <MemoryRouter initialEntries={[`/marketplace/drafts/${initialId}`]}>
      <Routes>
        <Route path="/marketplace/drafts/:id" element={<MarketplaceDraftPage />} />
      </Routes>
    </MemoryRouter>
  )
}

function ChangeDraft() {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate('/marketplace/drafts/d2')}>
      Open second draft
    </button>
  )
}

beforeEach(() => {
  state.drafts = {
    d1: draft('d1', 'Draft One'),
    d2: draft('d2', 'Draft Two'),
  }
  state.built = null
  state.removeResult = true
})

describe('MarketplaceDraftPage field values', () => {
  it('applies dotted and indexed values to a copy of the sanitized config', () => {
    state.drafts.d1 = draft('d1', 'Draft One', ['systemPrompt', 'agentSnapshot.inputs[0].default'])
    renderPage()

    fireEvent.change(screen.getByLabelText('systemPrompt'), { target: { value: 'my prompt' } })
    fireEvent.change(screen.getByLabelText('agentSnapshot.inputs[0].default'), {
      target: { value: 'my default' },
    })

    expect(state.built.config.systemPrompt).toBe('my prompt')
    expect(state.built.config.agentSnapshot.inputs[0].default).toBe('my default')
    expect(state.built.config.untouched).toBe(true)
    expect(state.drafts.d1.config.systemPrompt).toBe('publisher value')
    expect(state.drafts.d1.config.agentSnapshot.inputs[0].default).toBe('publisher default')
  })

  it('reloads the draft and clears in-memory values when only the route id changes', () => {
    render(
      <MemoryRouter initialEntries={['/marketplace/drafts/d1']}>
        <Routes>
          <Route
            path="/marketplace/drafts/:id"
            element={
              <>
                <ChangeDraft />
                <MarketplaceDraftPage />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText('systemPrompt'), { target: { value: 'secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Open second draft' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Draft Two' })).toBeInTheDocument()
    expect(screen.getByLabelText('systemPrompt')).toHaveValue('')
  })

  it('keeps the draft visible and explains when removal fails', () => {
    state.removeResult = false
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /Remove draft/ }))

    expect(screen.getByRole('alert')).toHaveTextContent('could not be removed')
    expect(screen.getByRole('heading', { level: 1, name: 'Draft One' })).toBeInTheDocument()
  })
})
