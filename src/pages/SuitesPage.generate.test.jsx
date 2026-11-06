import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ useApiKey: vi.fn(), generateCustomSuite: vi.fn() }))

vi.mock('../lib/useApiKey', () => ({ useApiKey: mocks.useApiKey }))
vi.mock('../lib/customSuiteGenerator', () => ({ generateCustomSuite: mocks.generateCustomSuite }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/SuiteWizard', () => ({ default: () => null }))

import SuitesPage from './SuitesPage'

function WorkflowMarker() {
  const location = useLocation()
  return <div>Workflow: {location.state?.workflowTitle} / {location.state?.preselectedAgents?.join(',')}</div>
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/suites']}>
      <Routes>
        <Route path="/suites" element={<SuitesPage />} />
        <Route path="/workflows/build" element={<WorkflowMarker />} />
        <Route path="/agent/:id" element={<div>Agent detail</div>} />
      </Routes>
    </MemoryRouter>
  )
}

const generated = {
  title: 'Interview sprint',
  description: 'A focused interview plan',
  agents: [{ id: 'summarizer', reason: 'Condenses notes' }],
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useApiKey.mockReturnValue({
    provider: 'openai', setProvider: vi.fn(), apiKey: 'key', setApiKey: vi.fn(),
    saveForSession: false, setSaveForSession: vi.fn(),
  })
})

describe('SuitesPage custom generation', () => {
  it('disables Generate without a goal or key', () => {
    mocks.useApiKey.mockReturnValue({
      provider: 'openai', setProvider: vi.fn(), apiKey: '', setApiKey: vi.fn(),
      saveForSession: false, setSaveForSession: vi.fn(),
    })
    renderPage()
    expect(screen.getByRole('button', { name: /Generate/ })).toBeDisabled()
  })

  it('renders a generated suite and hands its ids to the workflow builder', async () => {
    mocks.generateCustomSuite.mockResolvedValue(generated)
    renderPage()
    fireEvent.change(screen.getByLabelText('Goal for the agent suite'), { target: { value: 'Interview prep' } })
    fireEvent.click(screen.getByRole('button', { name: /Generate/ }))

    await screen.findByRole('heading', { name: 'Interview sprint' })
    expect(screen.getByText('A focused interview plan')).toBeInTheDocument()
    expect(screen.getByText('summarizer')).toBeInTheDocument()
    expect(screen.getByText('Condenses notes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Create workflow/ }))
    expect(screen.getByText('Workflow: Interview sprint / summarizer')).toBeInTheDocument()
  })

  it('submits the same request on Enter and opens a generated agent', async () => {
    mocks.generateCustomSuite.mockResolvedValue(generated)
    renderPage()
    const input = screen.getByLabelText('Goal for the agent suite')
    fireEvent.change(input, { target: { value: 'Interview prep' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await screen.findByRole('heading', { name: 'Interview sprint' })
    expect(mocks.generateCustomSuite).toHaveBeenCalledWith('Interview prep', 'key', 'openai')
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Agent detail')).toBeInTheDocument()
  })
})
