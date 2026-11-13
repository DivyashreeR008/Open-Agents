import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ useApiKey: vi.fn(), generateCustomSuite: vi.fn() }))

vi.mock('../lib/useApiKey', () => ({ useApiKey: mocks.useApiKey }))
vi.mock('../lib/customSuiteGenerator', () => ({ generateCustomSuite: mocks.generateCustomSuite }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/SuiteWizard', () => ({ default: () => null }))

import SuitesPage from './SuitesPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <SuitesPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.generateCustomSuite.mockReset()
  mocks.useApiKey.mockReturnValue({
    provider: 'openai',
    setProvider: vi.fn(),
    apiKey: 'key',
    setApiKey: vi.fn(),
    saveForSession: false,
    setSaveForSession: vi.fn(),
  })
})

describe('SuitesPage generation failures', () => {
  it('shows the retry message and re-enables Generate after a rejection', async () => {
    mocks.generateCustomSuite.mockRejectedValueOnce(new Error('network')).mockResolvedValueOnce({
      title: 'Retry suite',
      description: 'Recovered',
      agents: [{ id: 'a1', reason: 'fits' }],
    })
    renderPage()
    fireEvent.change(screen.getByLabelText('Goal for the agent suite'), {
      target: { value: 'Plan' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Generate/ }))

    await screen.findByText(
      'The OpenAI service could not be reached. Check your connection, then retry.'
    )
    expect(screen.getByRole('button', { name: /Generate/ })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await screen.findByRole('heading', { name: 'Retry suite' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('clears the generated suite and goal on Reset', async () => {
    mocks.generateCustomSuite.mockResolvedValue({
      title: 'Resettable suite',
      description: 'Done',
      agents: [{ id: 'a1', reason: 'fits' }],
    })
    renderPage()
    const input = screen.getByLabelText('Goal for the agent suite')
    fireEvent.change(input, { target: { value: 'Plan' } })
    fireEvent.click(screen.getByRole('button', { name: /Generate/ }))
    await screen.findByRole('heading', { name: 'Resettable suite' })

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(screen.queryByRole('heading', { name: 'Resettable suite' })).not.toBeInTheDocument()
    expect(input).toHaveValue('')
  })
})
