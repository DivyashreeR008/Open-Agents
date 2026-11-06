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
  SCHEDULE_OPTIONS: [{ value: 'daily', label: 'Every day' }],
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/OutputRenderer', () => ({
  default: ({ content }) => <div>Output: {content}</div>,
}))

import SchedulerPage from './SchedulerPage'

const jobs = [
  {
    id: 'j1',
    label: 'Morning digest',
    agentName: 'Summarizer',
    schedule: 'daily',
    enabled: true,
    lastRunAt: 1700000000000,
    nextRunAt: null,
  },
  {
    id: 'j2',
    label: 'Weekly review',
    agentName: 'Reviewer',
    schedule: 'daily',
    enabled: true,
    lastRunAt: 1700000000000,
    nextRunAt: null,
  },
]
const results = [
  {
    id: 'r1',
    jobId: 'j1',
    output: 'First digest',
    ranAt: 1700000000000,
    duration: 1200,
    agentName: 'Summarizer',
  },
  {
    id: 'r2',
    jobId: 'j1',
    error: 'Provider failed',
    ranAt: 1700000100000,
    agentName: 'Summarizer',
  },
  { id: 'r3', jobId: 'j2', output: 'Weekly output', ranAt: 1700000200000, agentName: 'Reviewer' },
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
  scheduler.results = results
  scheduler.running = {}
})

describe('SchedulerPage results and deletion', () => {
  it('confirms deletion and clears only that job history', () => {
    renderPage()
    fireEvent.click(screen.getAllByTitle('Delete')[0])
    expect(scheduler.deleteJob).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(scheduler.deleteJob).toHaveBeenCalledWith('j1')
    expect(scheduler.clearResultsForJob).toHaveBeenCalledWith('j1')
  })

  it('cancels a pending deletion', () => {
    const { container } = renderPage()
    fireEvent.click(screen.getAllByTitle('Delete')[1])
    const cancel = container.querySelectorAll('.lucide-x')[0].closest('button')
    fireEvent.click(cancel)
    expect(scheduler.deleteJob).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument()
  })

  it('expands one job history and ignores other jobs', () => {
    renderPage()
    fireEvent.click(screen.getAllByTitle('View results')[0])
    expect(screen.getByText('2 results')).toBeInTheDocument()
    expect(screen.queryByText('Weekly output')).not.toBeInTheDocument()
  })

  it('renders the no-results hint for an empty history', () => {
    scheduler.results = []
    renderPage()
    fireEvent.click(screen.getAllByTitle('View results')[0])
    expect(screen.getByText(/No results yet/)).toBeInTheDocument()
  })

  it('views successful and errored runs and deletes a stored run', () => {
    const { container } = renderPage()
    fireEvent.click(screen.getAllByTitle('View results')[0])
    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[0])
    expect(screen.getByText('Output: First digest')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Hide' })[0])
    expect(screen.queryByText('Output: First digest')).not.toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[1])
    expect(screen.getByText('Provider failed')).toBeInTheDocument()

    const deleteButton = container.querySelector('.lucide-x').closest('button')
    fireEvent.click(deleteButton)
    expect(scheduler.deleteResult).toHaveBeenCalledWith('r1')
  })

  it('clears all history for the expanded job', () => {
    renderPage()
    fireEvent.click(screen.getAllByTitle('View results')[0])
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(scheduler.clearResultsForJob).toHaveBeenCalledWith('j1')
  })

  it('renders the no-results hint and singular count', () => {
    scheduler.results = [results[2]]
    renderPage()
    fireEvent.click(screen.getAllByTitle('View results')[1])
    expect(screen.getByText('1 result')).toBeInTheDocument()
    expect(screen.queryByText('Output: Weekly output')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'View' }))
    expect(screen.getByText('Output: Weekly output')).toBeInTheDocument()
  })
})
