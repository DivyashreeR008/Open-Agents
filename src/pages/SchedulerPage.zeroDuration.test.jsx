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

function formatStamp(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
  vi.clearAllMocks()
  scheduler.running = {}
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('SchedulerPage zero-duration results', () => {
  it('omits the duration suffix when a stored run reports zero milliseconds', () => {
    const ranAt = NOW - 60_000
    scheduler.jobs = [
      {
        id: 'j1',
        label: 'Instant job',
        agentName: 'Agent',
        schedule: 'daily',
        enabled: true,
        lastRunAt: ranAt,
        nextRunAt: null,
      },
    ]
    scheduler.results = [
      {
        id: 'r1',
        jobId: 'j1',
        output: 'Instant output',
        ranAt,
        duration: 0,
        agentName: 'Agent',
      },
    ]

    render(
      <MemoryRouter>
        <SchedulerPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTitle('View results'))

    expect(screen.getByText(formatStamp(ranAt))).toBeInTheDocument()
    expect(screen.queryByText(/· 0/)).not.toBeInTheDocument()
  })
})
