import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useAgents: vi.fn(),
  useDocumentTitle: vi.fn(),
}))

vi.mock('../lib/useAgents', () => ({ useAgents: mocks.useAgents }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: mocks.useDocumentTitle }))
vi.mock('../components/AgentRunner', () => ({
  default: ({ agent }) => <div>Runner for {agent.name}</div>,
}))
vi.mock('./NotFoundPage', () => ({ default: () => <div>Missing agent page</div> }))

import AgentPage from './AgentPage'

const agent = { id: 'alpha', name: 'Alpha Agent' }

function renderPage(id = 'alpha') {
  return render(
    <MemoryRouter initialEntries={[`/agent/${id}`]}>
      <Routes>
        <Route path="/agent/:id" element={<AgentPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  mocks.useAgents.mockReturnValue({
    agents: [agent],
    loading: false,
    error: null,
    reloadAgents: vi.fn(),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('AgentPage recent tracking', () => {
  it('moves the current id to the front and removes duplicates', () => {
    localStorage.setItem('recentAgents', JSON.stringify(['old', 'alpha', 'older']))
    renderPage()
    expect(JSON.parse(localStorage.getItem('recentAgents'))).toEqual(['alpha', 'old', 'older'])
  })

  it('keeps only the five newest ids', () => {
    localStorage.setItem('recentAgents', JSON.stringify(['b', 'c', 'd', 'e', 'f', 'g']))
    renderPage()
    expect(JSON.parse(localStorage.getItem('recentAgents'))).toEqual(['alpha', 'b', 'c', 'd', 'e'])
  })

  it('survives corrupt stored JSON and still renders the runner', () => {
    localStorage.setItem('recentAgents', '{not json')
    renderPage()
    expect(screen.getByText('Runner for Alpha Agent')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('recentAgents'))).toEqual(['alpha'])
  })

  it('survives a non-array stored value', () => {
    localStorage.setItem('recentAgents', JSON.stringify({ id: 'alpha' }))
    renderPage()
    expect(JSON.parse(localStorage.getItem('recentAgents'))).toEqual(['alpha'])
  })

  it('does not break when the storage write is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })
    renderPage()
    expect(screen.getByText('Runner for Alpha Agent')).toBeInTheDocument()
  })

  it('does not write anything when the id is unknown', () => {
    renderPage('missing')
    expect(localStorage.getItem('recentAgents')).toBeNull()
  })
})
