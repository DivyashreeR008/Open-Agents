import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const scheduler = vi.hoisted(() => ({
  jobs: [],
  results: [],
  running: {},
  toggleJob: vi.fn(),
  deleteJob: vi.fn(),
  runJob: vi.fn(),
  deleteResult: vi.fn(),
  clearResultsForJob: vi.fn(),
}))

vi.mock('../lib/useScheduler', () => ({
  useScheduler: () => scheduler,
  SCHEDULE_OPTIONS: [{ value: 'daily', label: 'Every day' }],
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))

import SchedulerPage from './SchedulerPage'

const NOW = Date.UTC(2026, 0, 15, 12, 0, 0)

function renderPage() {
  return render(
    <MemoryRouter>
      <SchedulerPage />
    </MemoryRouter>
  )
}

function formatStamp(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function baseJob(overrides) {
  return {
    id: 'job',
    label: 'Scheduled run',
    agentName: 'Agent',
    schedule: 'daily',
    enabled: true,
    lastRunAt: null,
    nextRunAt: null,
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
  vi.clearAllMocks()
  scheduler.jobs = []
  scheduler.results = []
  scheduler.running = {}
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('SchedulerPage due-time boundaries', () => {
  it('labels past and sub-hour next runs as due now or minute remainders', () => {
    scheduler.jobs = [
      baseJob({ id: 'due', label: 'Past due', nextRunAt: NOW - 1 }),
      baseJob({ id: 'minutes', label: 'Minutes away', nextRunAt: NOW + 5 * 60_000 + 30_000 }),
      baseJob({ id: 'hours', label: 'Hours away', nextRunAt: NOW + 2 * 3_600_000 + 5 * 60_000 }),
    ]

    renderPage()

    expect(screen.getByText('Next: Due now')).toBeInTheDocument()
    expect(screen.getByText('Next: in 5m')).toBeInTheDocument()
    expect(screen.getByText('Next: in 2h 5m')).toBeInTheDocument()
  })
})

describe('SchedulerPage stored-run timestamps', () => {
  it('formats a year-boundary timestamp and a millisecond duration from storage', () => {
    const lastRunAt = Date.UTC(2025, 11, 31, 23, 59, 30)
    const ranAt = Date.UTC(2026, 0, 1, 0, 0, 5)

    scheduler.jobs = [
      baseJob({ id: 'j1', label: 'Boundary job', lastRunAt, nextRunAt: NOW + 60_000 }),
    ]
    scheduler.results = [
      {
        id: 'r1',
        jobId: 'j1',
        output: 'Boundary output',
        ranAt,
        duration: 450,
        agentName: 'Agent',
      },
    ]

    renderPage()

    expect(screen.getByText(`Last run: ${formatStamp(lastRunAt)}`)).toBeInTheDocument()
    fireEvent.click(screen.getByTitle('View results'))
    expect(
      screen.getByText(
        new RegExp(`${formatStamp(ranAt).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} .* 450ms`)
      )
    ).toBeInTheDocument()
  })
})
