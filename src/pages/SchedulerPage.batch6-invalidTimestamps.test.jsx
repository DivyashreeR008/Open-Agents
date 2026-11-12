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

beforeEach(() => {
  vi.clearAllMocks()
  scheduler.jobs = [
    {
      id: 'job',
      label: 'Corrupt schedule',
      agentName: 'Agent',
      schedule: 'daily',
      enabled: true,
      lastRunAt: 'not-a-date',
      nextRunAt: 'not-a-date',
    },
  ]
  scheduler.results = [
    {
      id: 'result',
      jobId: 'job',
      ranAt: 'not-a-date',
      duration: 'oops',
      output: 'Stored output',
      agentName: 'Agent',
    },
  ]
  scheduler.running = {}
})

afterEach(cleanup)

describe('SchedulerPage corrupt stored timestamps', () => {
  it('falls back safely instead of printing Invalid Date, NaNs, or NaN remainders', () => {
    render(
      <MemoryRouter>
        <SchedulerPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Last run: Unknown')).toBeInTheDocument()
    expect(screen.getByText('Next: —')).toBeInTheDocument()

    fireEvent.click(screen.getByTitle('View results'))

    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.queryByText(/NaNs/)).not.toBeInTheDocument()
    expect(screen.queryByText(/oops/)).not.toBeInTheDocument()
  })
})
