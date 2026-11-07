import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({
  useApiKey: vi.fn(),
  generateCustomSuite: vi.fn(),
}))

vi.mock('../lib/useApiKey', () => ({ useApiKey: mocks.useApiKey }))
vi.mock('../lib/customSuiteGenerator', () => ({ generateCustomSuite: mocks.generateCustomSuite }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/SuiteWizard', () => ({
  default: ({ suite, onBack }) => (
    <div>
      Wizard for {suite.name}
      <button onClick={onBack}>Leave suite</button>
    </div>
  ),
}))

import SuitesPage from './SuitesPage'
import { suites } from '../suites/suitesData'

function renderPage() {
  return render(
    <MemoryRouter>
      <SuitesPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useApiKey.mockReturnValue({
    provider: 'openai',
    setProvider: vi.fn(),
    apiKey: 'sk-test',
    setApiKey: vi.fn(),
    saveForSession: false,
    setSaveForSession: vi.fn(),
  })
  mocks.generateCustomSuite.mockResolvedValue({
    title: 'Custom path',
    description: 'A generated plan',
    agents: [],
  })
})

describe('SuitesPage keyboard generation and wizard navigation', () => {
  it('ignores Enter for a whitespace goal and generates for a real goal', async () => {
    renderPage()
    const goal = screen.getByLabelText('Goal for the agent suite')

    fireEvent.change(goal, { target: { value: '   ' } })
    fireEvent.keyDown(goal, { key: 'Enter' })
    expect(mocks.generateCustomSuite).not.toHaveBeenCalled()

    fireEvent.change(goal, { target: { value: 'Prepare for interviews' } })
    fireEvent.keyDown(goal, { key: 'Enter' })
    await waitFor(() =>
      expect(mocks.generateCustomSuite).toHaveBeenCalledWith(
        'Prepare for interviews',
        'sk-test',
        'openai'
      )
    )
    expect(await screen.findByText('Custom path')).toBeInTheDocument()
  })

  it('opens a suite card and returns to the browse grid', async () => {
    renderPage()
    const suite = suites[0]

    fireEvent.click(screen.getByRole('heading', { name: suite.name }).closest('button'))
    expect(screen.getByText('Wizard for ' + suite.name)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Leave suite' }))
    expect(screen.queryByText('Wizard for ' + suite.name)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Suites' })).toBeInTheDocument()
  })
})
