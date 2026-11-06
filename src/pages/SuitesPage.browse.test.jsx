import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ useApiKey: vi.fn(), generateCustomSuite: vi.fn() }))

vi.mock('../lib/useApiKey', () => ({ useApiKey: mocks.useApiKey }))
vi.mock('../lib/customSuiteGenerator', () => ({ generateCustomSuite: mocks.generateCustomSuite }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => <div data-testid="key-bar" /> }))
vi.mock('../components/SuiteWizard', () => ({ default: () => <div>Suite wizard</div> }))

import SuitesPage from './SuitesPage'
import { suites } from '../suites/suitesData'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/suites']}>
      <Routes>
        <Route path="/suites" element={<SuitesPage />} />
        <Route path="/agents" element={<div>Agent index</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useApiKey.mockReturnValue({
    provider: 'openai', setProvider: vi.fn(), apiKey: 'key', setApiKey: vi.fn(),
    saveForSession: false, setSaveForSession: vi.fn(),
  })
})

describe('SuitesPage browse state', () => {
  it('renders the page heading and one card per curated suite', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Suites' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(suites.length + 1)
    for (const suite of suites) {
      expect(screen.getByRole('heading', { name: suite.name })).toBeInTheDocument()
    }
  })

  it('renders the custom-suite generator and the key bar', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Build your own suite' })).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()
    expect(screen.getByTestId('key-bar')).toBeInTheDocument()
  })

  it('opens the agent catalogue from the browse-all footer', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /View all agents/ }))
    expect(screen.getByText('Agent index')).toBeInTheDocument()
  })
})
