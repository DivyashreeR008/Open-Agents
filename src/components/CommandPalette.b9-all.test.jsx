import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mocks = vi.hoisted(() => ({ navigate: vi.fn(), close: vi.fn() }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mocks.navigate }
})
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useCollections', () => ({ useCollections: () => ({ collections: [] }) }))
vi.mock('../hooks/useWorkflows', () => ({ fetchWorkflows: () => Promise.resolve({ data: [] }) }))
vi.mock('../hooks/useDialogFocus', () => ({ useDialogFocus: vi.fn() }))
vi.mock('../suites/suitesData', () => ({
  suites: [
    {
      id: 'developer',
      name: 'Developer Suite',
      description: 'Ship better code',
      agents: ['code-reviewer', 'unit-test-generator'],
    },
  ],
}))
vi.mock('../lib/marketplace', () => ({
  loadListings: () => [
    { id: 'l1', name: 'Alpha support kit', author: 'Sam', category: 'Research' },
  ],
}))
vi.mock('../lib/automationsService', () => ({
  loadAutomations: () => [
    { id: 'a1', name: 'Nightly triage', description: 'Review new issues every night' },
  ],
}))

import CommandPalette from './CommandPalette'

function renderPalette() {
  return render(
    <MemoryRouter>
      <CommandPalette isOpen onClose={mocks.close} />
    </MemoryRouter>
  )
}

describe('CommandPalette whole-app search', () => {
  it('finds suites and labels them as suites', async () => {
    renderPalette()
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Developer Suite' } })

    const option = await screen.findByRole('option', { name: /Developer Suite/ })
    expect(option).toHaveTextContent('suite')
    fireEvent.click(option)

    expect(mocks.close).toHaveBeenCalled()
    expect(mocks.navigate).toHaveBeenCalledWith('/suites')
  })

  it('finds marketplace listings and opens the marketplace', async () => {
    renderPalette()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Alpha support' } })

    const option = await screen.findByRole('option', { name: /Alpha support kit/ })
    expect(option).toHaveTextContent('listing')
    fireEvent.click(option)

    expect(mocks.navigate).toHaveBeenCalledWith('/marketplace')
  })

  it('finds saved automations and opens the schedule page', async () => {
    renderPalette()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Nightly triage' } })

    const option = await screen.findByRole('option', { name: /Nightly triage/ })
    expect(option).toHaveTextContent('automation')
    fireEvent.click(option)

    expect(mocks.navigate).toHaveBeenCalledWith('/automations')
  })
})
