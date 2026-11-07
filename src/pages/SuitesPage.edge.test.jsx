import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  useApiKey: vi.fn(),
  generateCustomSuite: vi.fn(),
}))

vi.mock('../lib/useApiKey', () => ({ useApiKey: mocks.useApiKey }))
vi.mock('../lib/customSuiteGenerator', () => ({ generateCustomSuite: mocks.generateCustomSuite }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => null }))
vi.mock('../components/SuiteWizard', () => ({ default: () => null }))

import SuitesPage from './SuitesPage'

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
})

describe('SuitesPage generator whitespace gate', () => {
  it('keeps Generate disabled for a whitespace-only goal and enables it for a real goal', () => {
    render(
      <MemoryRouter>
        <SuitesPage />
      </MemoryRouter>
    )

    const goal = screen.getByLabelText('Goal for the agent suite')
    const generate = screen.getByRole('button', { name: /Generate/ })

    fireEvent.change(goal, { target: { value: '   ' } })
    expect(generate).toBeDisabled()

    fireEvent.change(goal, { target: { value: 'Prepare for interviews' } })
    expect(generate).not.toBeDisabled()
    expect(mocks.generateCustomSuite).not.toHaveBeenCalled()
  })
})
