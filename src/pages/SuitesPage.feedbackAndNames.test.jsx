import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AgentsContext } from '../lib/useAgents'

const mocks = vi.hoisted(() => ({ useApiKey: vi.fn(), generateCustomSuite: vi.fn() }))

vi.mock('../lib/useApiKey', () => ({ useApiKey: mocks.useApiKey }))
vi.mock('../lib/customSuiteGenerator', () => ({ generateCustomSuite: mocks.generateCustomSuite }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/SuiteWizard', () => ({ default: () => null }))

import SuitesPage from './SuitesPage'

const agents = [{ id: 'api-doc-generator', name: 'API Doc Generator', category: 'Engineering' }]
const generated = {
  title: 'API plan',
  description: 'Document the API',
  agents: [{ id: 'api-doc-generator', reason: 'Writes endpoint docs' }],
}

const apiKeyState = (overrides = {}) => ({
  provider: 'openai',
  setProvider: vi.fn(),
  apiKey: 'key',
  setApiKey: vi.fn(),
  saveForSession: false,
  setSaveForSession: vi.fn(),
  ...overrides,
})

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/suites']}>
      <AgentsContext.Provider
        value={{
          agents,
          loading: false,
          error: null,
          reloadAgents: vi.fn(),
          catalogSize: agents.length,
        }}
      >
        <Routes>
          <Route path="/suites" element={<SuitesPage />} />
          <Route path="/agent/:id" element={<div>Agent detail</div>} />
        </Routes>
      </AgentsContext.Provider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.generateCustomSuite.mockReset()
  mocks.useApiKey.mockReturnValue(apiKeyState())
})

describe('SuitesPage generation feedback and agent names', () => {
  it('names the missing goal when Enter cannot start generation', () => {
    renderPage()
    const goal = screen.getByLabelText('Goal for the agent suite')
    fireEvent.change(goal, { target: { value: '   ' } })
    fireEvent.keyDown(goal, { key: 'Enter' })

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a goal to generate a suite.')
    expect(mocks.generateCustomSuite).not.toHaveBeenCalled()
  })

  it('names the missing key and keeps it visible before a click', () => {
    mocks.useApiKey.mockReturnValue(apiKeyState({ apiKey: '' }))
    renderPage()
    const goal = screen.getByLabelText('Goal for the agent suite')
    fireEvent.change(goal, { target: { value: 'Document an API' } })

    expect(screen.getByRole('status')).toHaveTextContent(
      'Add an API key for openai to generate a suite.'
    )
    fireEvent.keyDown(goal, { key: 'Enter' })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Add an API key for openai to generate a suite.'
    )
    expect(mocks.generateCustomSuite).not.toHaveBeenCalled()
  })

  it('shows catalogue names, hides slugs, and names the open target', async () => {
    mocks.generateCustomSuite.mockResolvedValue(generated)
    renderPage()
    fireEvent.change(screen.getByLabelText('Goal for the agent suite'), {
      target: { value: 'Document an API' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Generate/ }))

    expect(await screen.findByText('API Doc Generator')).toBeInTheDocument()
    expect(screen.queryByText('api-doc-generator')).not.toBeInTheDocument()
    const open = screen.getByRole('button', { name: 'Open API Doc Generator' })
    fireEvent.click(open)
    expect(screen.getByText('Agent detail')).toBeInTheDocument()
  })

  it('offers retry for a rate limit but not for a rejected key', async () => {
    mocks.generateCustomSuite
      .mockRejectedValueOnce(Object.assign(new Error('invalid_api_key'), { status: 401 }))
      .mockRejectedValueOnce(Object.assign(new Error('Rate limit hit'), { status: 429 }))
      .mockResolvedValueOnce(generated)
    renderPage()
    fireEvent.change(screen.getByLabelText('Goal for the agent suite'), {
      target: { value: 'Document an API' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Generate/ }))

    expect(
      await screen.findByText(
        'The OpenAI API key was rejected. Replace the key, then generate again.'
      )
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Generate/ }))
    expect(
      await screen.findByText('The OpenAI rate limit was reached. Wait a moment, then retry.')
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByRole('heading', { name: 'API plan' })).toBeInTheDocument()
  })
})
