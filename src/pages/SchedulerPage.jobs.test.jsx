import { describe, expect, it, vi, beforeEach } from 'vitest'
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
  SCHEDULE_OPTIONS: [
    { value: 'daily', label: 'Every day' },
    { value: 'hourly', label: 'Every hour' },
  ],
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))

import SchedulerPage from './SchedulerPage'

const nextRunAt = Date.now() + 3 * 86400000 + 2 * 3600000 + 90000
const jobs = [
  {
    id: 'j1',
    label: 'Morning digest',
    agentName: 'Summarizer',
    schedule: 'daily',
    enabled: true,
    lastRunAt: 1700000000000,
    nextRunAt,
  },
  {
    id: 'j2',
    label: 'Weekly review',
    agentName: 'Reviewer',
    schedule: 'custom-weekly',
    enabled: false,
    lastRunAt: null,
    nextRunAt: null,
  },
]

function renderPage() {
  return render(
    <MemoryRouter>
      <SchedulerPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  scheduler.jobs = jobs
  scheduler.results = []
  scheduler.running = {}
})

describe('SchedulerPage job metadata', () => {
  it('renders enabled and paused jobs with schedule fallbacks', () => {
    renderPage()
    expect(screen.getByText('Morning digest')).toBeInTheDocument()
    expect(screen.getByText('Every day')).toBeInTheDocument()
    expect(screen.getByText('Summarizer')).toBeInTheDocument()
    expect(screen.getByText('custom-weekly')).toBeInTheDocument()
    expect(screen.getByText('Paused')).toBeInTheDocument()
    expect(screen.getByText(/Next: in 3d 2h/)).toBeInTheDocument()
    expect(screen.getByText('Last run: Never')).toBeInTheDocument()
  })

  it('toggles and runs the selected job', () => {
    renderPage()
    fireEvent.click(screen.getByTitle('Disable'))
    expect(scheduler.toggleJob).toHaveBeenCalledWith('j1')
    fireEvent.click(screen.getAllByTitle('Run now')[0])
    expect(scheduler.runJob).toHaveBeenCalledWith(jobs[0])
    fireEvent.click(screen.getByTitle('Enable'))
    expect(scheduler.toggleJob).toHaveBeenCalledWith('j2')
  })

  it('disables run now while a job is running', () => {
    scheduler.running = { j1: true }
    renderPage()
    expect(screen.getAllByTitle('Run now')[0]).toBeDisabled()
    expect(screen.getAllByTitle('Run now')[1]).toBeEnabled()
  })
})
