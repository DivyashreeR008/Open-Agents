import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import CommandPalette from './CommandPalette'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../lib/useAgents', () => ({
  useAgents: () => ({
    agents: [
      {
        id: 'code-reviewer',
        name: 'Code Reviewer Agent',
        description: 'Automated PR reviewer',
        category: 'Engineering',
      },
      {
        id: 'seo-writer',
        name: 'SEO Copywriter',
        description: 'Optimizes content for search engines',
        category: 'Marketing',
      },
    ],
    catalogSize: 2,
  }),
}))

vi.mock('../lib/useCollections', () => ({
  useCollections: () => ({
    collections: [
      {
        id: 'devops-bundle',
        name: 'DevOps Tools',
        agentIds: ['code-reviewer'],
      },
    ],
  }),
}))

vi.mock('../hooks/useWorkflows', () => ({
  fetchWorkflows: vi.fn().mockResolvedValue({
    data: [
      {
        id: 'ci-cd-pipeline',
        title: 'CI/CD Workflow Pipeline',
        description: 'Automated deployment pipeline',
      },
    ],
  }),
}))

describe('CommandPalette', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <MemoryRouter>
        <CommandPalette isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders with proper dialog and combobox accessibility semantics', async () => {
    render(
      <MemoryRouter>
        <CommandPalette {...defaultProps} />
      </MemoryRouter>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Command palette')

    const combobox = screen.getByRole('combobox')
    expect(combobox).toBeInTheDocument()
    expect(combobox).toHaveAttribute('aria-autocomplete', 'list')
    expect(combobox).toHaveAttribute('aria-controls', 'command-palette-results')
    expect(combobox).toHaveAttribute('aria-expanded', 'true')

    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
    expect(listbox).toHaveAttribute('id', 'command-palette-results')

    const options = screen.getAllByRole('option')
    expect(options.length).toBeGreaterThan(0)
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('autofocuses the search input upon opening', () => {
    render(
      <MemoryRouter>
        <CommandPalette {...defaultProps} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')
    expect(document.activeElement).toBe(input)
  })

  it('searches and filters agents, collections, workflows, and settings', async () => {
    render(
      <MemoryRouter>
        <CommandPalette {...defaultProps} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')

    // Search for an agent
    fireEvent.change(input, { target: { value: 'Code Reviewer' } })
    expect(screen.getByText('Code Reviewer Agent')).toBeInTheDocument()

    // Search for a collection
    fireEvent.change(input, { target: { value: 'DevOps Tools' } })
    expect(screen.getByText('DevOps Tools')).toBeInTheDocument()

    // Search for a workflow
    await waitFor(() => {
      fireEvent.change(input, { target: { value: 'CI/CD Workflow' } })
      expect(screen.getByText('CI/CD Workflow Pipeline')).toBeInTheDocument()
    })

    // Search for settings
    fireEvent.change(input, { target: { value: 'API Keys' } })
    expect(screen.getByText('API Keys & Providers')).toBeInTheDocument()
  })

  it('navigates through options with ArrowDown and ArrowUp', () => {
    render(
      <MemoryRouter>
        <CommandPalette {...defaultProps} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')
    const options = screen.getAllByRole('option')

    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')

    // Press ArrowDown
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const updatedOptions1 = screen.getAllByRole('option')
    expect(updatedOptions1[0]).toHaveAttribute('aria-selected', 'false')
    expect(updatedOptions1[1]).toHaveAttribute('aria-selected', 'true')

    // Press ArrowUp
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    const updatedOptions2 = screen.getAllByRole('option')
    expect(updatedOptions2[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('selects the active option with Enter and navigates', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Code Reviewer' } })

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/agent/code-reviewer')
  })

  it('selects an option when clicked', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'DevOps Tools' } })

    const option = screen.getByText('DevOps Tools')
    fireEvent.click(option)

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/collections/devops-bundle')
  })

  it('closes when Escape is pressed', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('closes when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )

    const backdrop = screen.getByRole('dialog').parentElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows empty state when no matching results are found', () => {
    render(
      <MemoryRouter>
        <CommandPalette {...defaultProps} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'nonexistentquery123456' } })

    expect(screen.getByText(/No results found/i)).toBeInTheDocument()
  })

  it('clears query when clear button is clicked', () => {
    render(
      <MemoryRouter>
        <CommandPalette {...defaultProps} />
      </MemoryRouter>
    )

    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'settings' } })
    expect(input.value).toBe('settings')

    const clearButton = screen.getByLabelText('Clear search')
    fireEvent.click(clearButton)
    expect(input.value).toBe('')
  })
})
