import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
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
vi.mock('../components/OutputRenderer', () => ({
  default: ({ content }) => <div>Output: {content}</div>,
}))

import SchedulerPage from './SchedulerPage'

const job = {
  id: 'j1',
  label: 'Morning digest',
  agentName: 'Summarizer',
  schedule: 'daily',
  enabled: true,
  lastRunAt: 1700000000000,
  nextRunAt: null,
}

const result = {
  id: 'r1',
  jobId: 'j1',
  output: 'First digest',
  ranAt: 1700000000000,
  duration: 1200,
  agentName: 'Summarizer',
}

beforeEach(() => {
  vi.clearAllMocks()
  scheduler.jobs = [job]
  scheduler.results = [result]
  scheduler.running = {}
})

describe('SchedulerPage result collapse', () => {
  it('closes the expanded history when the same job is toggled again', () => {
    render(
      <MemoryRouter>
        <SchedulerPage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTitle('View results'))
    expect(screen.getByText('1 result')).toBeInTheDocument()
    expect(screen.getByText('View')).toBeInTheDocument()

    fireEvent.click(screen.getByTitle('View results'))
    expect(screen.queryByText('1 result')).not.toBeInTheDocument()
    expect(screen.queryByText('View')).not.toBeInTheDocument()
  })
})
