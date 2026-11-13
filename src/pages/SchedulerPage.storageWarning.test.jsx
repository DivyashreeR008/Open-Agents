import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
  clearAllResults: vi.fn(),
  storageError:
    'Browser storage is full or unavailable. Job and result changes may not survive a reload.',
}))

vi.mock('../lib/useScheduler', () => ({
  useScheduler: () => scheduler,
  SCHEDULE_OPTIONS: [{ value: 'daily', label: 'Every day' }],
  MAX_RESULT_OUTPUT_CHARS: 20_000,
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))

import SchedulerPage from './SchedulerPage'

beforeEach(() => {
  vi.clearAllMocks()
  scheduler.jobs = []
  scheduler.results = []
  scheduler.running = {}
  scheduler.storageError =
    'Browser storage is full or unavailable. Job and result changes may not survive a reload.'
})

describe('SchedulerPage storage warning', () => {
  it('reports the failed writes and offers a way to free result space', () => {
    render(
      <MemoryRouter>
        <SchedulerPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Browser storage is full or unavailable')
    fireEvent.click(screen.getByRole('button', { name: 'Clear all run results to free space' }))
    expect(scheduler.clearAllResults).toHaveBeenCalledTimes(1)
  })

  it('labels a trimmed output with its stored and original sizes', () => {
    scheduler.storageError = null
    scheduler.jobs = [
      {
        id: 'j1',
        label: 'Digest',
        agentName: 'Digest',
        schedule: 'daily',
        enabled: true,
        lastRunAt: Date.now(),
        nextRunAt: null,
      },
    ]
    scheduler.results = [
      {
        id: 'r1',
        jobId: 'j1',
        output: 'short',
        outputTruncated: true,
        originalOutputLength: 25_000,
        ranAt: Date.now(),
        duration: 5,
        agentName: 'Digest',
      },
    ]

    render(
      <MemoryRouter>
        <SchedulerPage />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByTitle('View results'))
    fireEvent.click(screen.getByRole('button', { name: 'View' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Output shortened to 20,000 characters from 25,000'
    )
  })
})
