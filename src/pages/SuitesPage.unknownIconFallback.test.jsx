import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ useApiKey: vi.fn(), generateCustomSuite: vi.fn() }))

vi.mock('../lib/useApiKey', () => ({ useApiKey: mocks.useApiKey }))
vi.mock('../lib/customSuiteGenerator', () => ({ generateCustomSuite: mocks.generateCustomSuite }))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/ApiKeyBar', () => ({ default: () => <div data-testid="key-bar" /> }))
vi.mock('../components/SuiteWizard', () => ({ default: () => <div>Suite wizard</div> }))
vi.mock('../suites/suitesData', () => ({
  suites: [
    {
      id: 'mystery',
      name: 'Mystery Suite',
      icon: 'NotARealIcon',
      description: 'A suite with an unknown icon name.',
      color: '#123456',
      agents: ['a1', 'a2'],
    },
  ],
}))

import SuitesPage from './SuitesPage'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.useApiKey.mockReturnValue({
    provider: 'openai',
    setProvider: vi.fn(),
    apiKey: 'key',
    setApiKey: vi.fn(),
    saveForSession: false,
    setSaveForSession: vi.fn(),
  })
})

describe('SuitesPage unknown suite icon', () => {
  it('falls back to the default icon when the suite names an unknown icon', () => {
    render(
      <MemoryRouter initialEntries={['/suites']}>
        <Routes>
          <Route path="/suites" element={<SuitesPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Mystery Suite' })).toBeInTheDocument()
    expect(screen.getByText('2 agents')).toBeInTheDocument()
  })
})
