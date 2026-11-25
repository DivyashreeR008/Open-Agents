import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import CommandPalette from './CommandPalette'

import { expectNoA11yViolations } from '../test/a11y'

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

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})
afterEach(() => vi.restoreAllMocks())
describe('global recent searches', () => {
  it('saves an activated query, replays it, deletes it, and keeps listbox semantics', async () => {
    const { rerender, container } = render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'Code Reviewer' } })
    expect(localStorage.getItem('oa_search_history_v1')).toBeNull()
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
    expect(mockNavigate).not.toHaveBeenCalled()
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/agent/code-reviewer')
    expect(JSON.parse(localStorage.getItem('oa_search_history_v1'))[0].surface).toBe('palette')
    rerender(
      <MemoryRouter>
        <CommandPalette isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    )
    rerender(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByText('Recent searches (1)'))
    fireEvent.click(screen.getByRole('button', { name: 'Code Reviewer', exact: true }))
    expect(screen.getByRole('combobox')).toHaveValue('Code Reviewer')
    expect(screen.getByRole('combobox')).toHaveFocus()
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('listbox').querySelector('button')).toBeNull()
    await expectNoA11yViolations(container)
    fireEvent.click(screen.getByRole('button', { name: /Remove search Code Reviewer/ }))
    expect(screen.getByText('Recent searches (0)')).toHaveFocus()
  })

  it('can remember a no-result query and clear both surfaces without touching other storage', async () => {
    localStorage.setItem('OpenAgents_history', 'keep')
    localStorage.setItem(
      'oa_search_history_v1',
      JSON.stringify([{ surface: 'catalogue', query: 'alpha' }])
    )
    render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: '<script>no results</script>' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remember search' }))
    fireEvent.click(screen.getByText('Recent searches (1)'))
    expect(
      screen.getByRole('button', { name: '<script>no results</script>', exact: true })
    ).toBeInTheDocument()
    expect(document.querySelector('script')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Clear all remembered searches' }))
    expect(localStorage.getItem('oa_search_history_v1')).toBeNull()
    expect(localStorage.getItem('OpenAgents_history')).toBe('keep')
    await act(async () => {})
  })

  it('shows a failed save even while recent searches is collapsed and still navigates', async () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen onClose={vi.fn()} />
      </MemoryRouter>
    )
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Code Reviewer' } })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    fireEvent.click(screen.getByRole('button', { name: 'Remember search' }))
    expect(screen.getByRole('alert')).toBeVisible()
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
    expect(mockNavigate).toHaveBeenCalledWith('/agent/code-reviewer')
    expect(localStorage.getItem('oa_search_history_v1')).toBeNull()
    await act(async () => {})
  })
})
