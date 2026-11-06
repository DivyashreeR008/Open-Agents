import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import RecentRuns from './RecentRuns'

const now = new Date('2026-01-01T12:00:00.000Z').getTime()

function makeRun(overrides = {}) {
  return {
    id: 'run-1',
    agentName: 'Code Reviewer',
    provider: 'OpenAI',
    output: 'The change looks correct.',
    timestamp: now - 30_000,
    ...overrides,
  }
}

describe('RecentRuns', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the empty state without list actions', () => {
    render(
      <RecentRuns
        history={[]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    expect(screen.getByText('Recent runs')).toBeInTheDocument()
    expect(screen.getByText('Runs you start will show up here.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear all history' })).not.toBeInTheDocument()
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('renders one article per run with the history count', () => {
    const { container } = render(
      <RecentRuns
        history={[
          makeRun(),
          makeRun({ id: 'run-2', agentName: 'Test Planner', provider: 'Anthropic', output: 'A different output.' }),
        ]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    expect(container.querySelectorAll('article')).toHaveLength(2)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Code Reviewer')).toBeInTheDocument()
    expect(screen.getByText('Test Planner')).toBeInTheDocument()
    expect(screen.getByText('The change looks correct.')).toBeInTheDocument()
  })

  it('formats relative timestamps at the minute, hour, and day boundaries', () => {
    render(
      <RecentRuns
        history={[
          makeRun({ id: 'now', timestamp: now - 30_000 }),
          makeRun({ id: 'minutes', timestamp: now - 5 * 60_000 }),
          makeRun({ id: 'hours', timestamp: now - 2 * 60 * 60_000 }),
          makeRun({ id: 'days', timestamp: now - 3 * 24 * 60 * 60_000 }),
        ]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    expect(screen.getByText('just now')).toBeInTheDocument()
    expect(screen.getByText('5m ago')).toBeInTheDocument()
    expect(screen.getByText('2h ago')).toBeInTheDocument()
    expect(screen.getByText('3d ago')).toBeInTheDocument()
  })

  it('uses the provider dot class and an unknown provider fallback', () => {
    const { container } = render(
      <RecentRuns
        history={[
          makeRun({ provider: 'OpenAI' }),
          makeRun({ id: 'run-2', provider: 'claude-3' }),
          makeRun({ id: 'run-3', provider: undefined }),
        ]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    const articles = [...container.querySelectorAll('article')]
    const dots = articles.map((article) => article.querySelector('.h-1\\.5'))
    expect(dots[0].className).toContain('bg-zinc-500')
    expect(dots[1].className).toContain('bg-zinc-400')
    expect(dots[2].className).toContain('bg-zinc-500')
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })

  it('wires clear, delete, rerun, and copy actions to their handlers', () => {
    const onClearAll = vi.fn()
    const onDelete = vi.fn()
    const onRerun = vi.fn()
    const onCopy = vi.fn()
    const runs = [
      makeRun(),
      makeRun({ id: 'run-2', output: 'Second output.' }),
    ]

    render(
      <RecentRuns
        history={runs}
        onRerun={onRerun}
        onCopy={onCopy}
        onDelete={onDelete}
        onClearAll={onClearAll}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Clear all history' }))
    expect(onClearAll).toHaveBeenCalledTimes(1)

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete run' })
    expect(deleteButtons[0]).toHaveClass('opacity-0')
    fireEvent.click(deleteButtons[0])
    expect(onDelete).toHaveBeenCalledWith('run-1')

    fireEvent.click(screen.getAllByRole('button', { name: 'Re-run' })[1])
    expect(onRerun).toHaveBeenCalledWith(runs[1])

    fireEvent.click(screen.getAllByRole('button', { name: 'Copy' })[0])
    expect(onCopy).toHaveBeenCalledWith(runs[0].output)
  })
})
