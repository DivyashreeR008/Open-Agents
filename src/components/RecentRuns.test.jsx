import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import RecentRuns from './RecentRuns'

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0)

const run = {
  id: 'run-1',
  agentName: 'Code Reviewer',
  provider: 'openai',
  output: 'The change is safe to merge.',
  timestamp: NOW - 30_000,
}

afterEach(() => {
  vi.useRealTimers()
})

describe('RecentRuns', () => {
  it('shows an empty state before any runs exist', () => {
    render(<RecentRuns history={[]} />)

    expect(screen.getByText('Runs you start will show up here.')).toBeInTheDocument()
  })

  it('refreshes relative ages while the page remains open', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW))

    render(
      <RecentRuns
        history={[run]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    expect(screen.getByText('just now')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(screen.getByText('1m ago')).toBeInTheDocument()
    expect(screen.queryByText('just now')).not.toBeInTheDocument()
  })

  it('keeps the exact timestamp available as a tooltip', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW))

    render(
      <RecentRuns
        history={[run]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    const label = screen.getByText('just now')
    expect(label.tagName).toBe('TIME')
    expect(label).toHaveAttribute('title')
    expect(label.getAttribute('title')).not.toBe('')
  })

  it('does not reshuffle entries when the clock advances', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(NOW))

    render(
      <RecentRuns
        history={[
          run,
          { ...run, id: 'run-2', agentName: 'API Doc Generator', timestamp: NOW - 5 * 60_000 },
        ]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    const before = screen.getAllByRole('heading').map((heading) => heading.textContent)
    act(() => {
      vi.advanceTimersByTime(90_000)
    })
    const after = screen.getAllByRole('heading').map((heading) => heading.textContent)

    expect(after).toEqual(before)
  })
})
