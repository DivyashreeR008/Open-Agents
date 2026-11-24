import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AnalyticsPage from './AnalyticsPage'
import { expectNoA11yViolations } from '../test/a11y'

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

function renderPage() {
  return render(
    <MemoryRouter>
      <AnalyticsPage />
    </MemoryRouter>
  )
}

describe('import coverage in the real analytics page', () => {
  it('shows sparse imports as gaps rather than a dominant placeholder slice', async () => {
    localStorage.setItem(
      'OpenAgents_history',
      JSON.stringify([
        { id: 'a_1', agentId: 'a', agentName: 'Sparse legacy run', timestamp: Date.now() },
      ])
    )
    const { container } = renderPage()
    expect(screen.getByText(/Run origins: 1 imported from history/)).toBeInTheDocument()
    expect(screen.getAllByText(/Known for 0 of 1 runs · 1 unknown/)).toHaveLength(2)
    expect(screen.getByText('No provider data')).toBeInTheDocument()
    expect(screen.getByText('No category data')).toBeInTheDocument()
    expect(screen.queryByText(/Unknown \(100%\)/)).not.toBeInTheDocument()
    expect(screen.queryByText('Uncategorized')).not.toBeInTheDocument()
    expect(screen.getByText('Imported from history')).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })

  it('exports the same coverage and explicit origins shown for mixed records', async () => {
    const now = Date.now()
    localStorage.setItem('oa_analytics_seeded', '1')
    localStorage.setItem(
      'oa_analytics',
      JSON.stringify([
        {
          id: 'a_1',
          agentId: 'a',
          agentName: 'Native',
          provider: 'openai',
          category: 'Research',
          origin: 'recorded',
          timestamp: now,
        },
        {
          id: 'b_2',
          agentId: 'b',
          agentName: 'Imported',
          origin: 'history-import',
          timestamp: now,
        },
        {
          id: 'c_3',
          agentId: 'c',
          agentName: 'Old unmarked',
          provider: 'gemini',
          category: 'Research',
          timestamp: now,
        },
      ])
    )
    const create = vi.fn(() => 'blob:coverage')
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = create
        static revokeObjectURL = vi.fn()
      }
    )
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    try {
      renderPage()
      expect(screen.getByText('Total Runs').previousElementSibling).toHaveTextContent('3')
      expect(
        screen.getByText(/1 imported from history · 1 recorded by analytics · 1 unknown/)
      ).toBeInTheDocument()
      expect(screen.getAllByText(/Known for 2 of 3 runs · 1 unknown/)).toHaveLength(2)
      expect(screen.getByText('OpenAI (50%)')).toBeInTheDocument()
      expect(screen.getByText('Gemini (50%)')).toBeInTheDocument()
      expect(screen.getByText('KNOWN RUNS').previousElementSibling).toHaveTextContent('2')
      expect(screen.getByText('Origin unknown')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Export Dashboard Data/ }))
      const exported = JSON.parse(await create.mock.calls[0][0].text())
      expect(exported.metadataCoverage.provider).toEqual({ known: 2, unknown: 1 })
      expect(exported.provenance).toEqual({ imported: 1, recorded: 1, unknown: 1 })
      expect(exported.recentRuns.map((r) => r.origin)).toEqual([
        'recorded',
        'history-import',
        'unknown',
      ])
      expect(click).toHaveBeenCalledOnce()
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
