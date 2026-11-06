import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest'
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
const requestPermission = vi.hoisted(() => vi.fn())

vi.mock('../lib/useScheduler', () => ({
  useScheduler: () => scheduler,
  SCHEDULE_OPTIONS: [{ value: 'daily', label: 'Every day' }],
}))
vi.mock('../lib/useDocumentTitle', () => ({ useDocumentTitle: vi.fn() }))
vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))

import SchedulerPage from './SchedulerPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <SchedulerPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  scheduler.jobs = []
  scheduler.results = []
  scheduler.running = {}
})

afterEach(() => vi.unstubAllGlobals())

describe('SchedulerPage empty and notification states', () => {
  it('renders the empty schedule guidance', () => {
    vi.stubGlobal('Notification', { permission: 'default', requestPermission })
    renderPage()
    expect(screen.getByRole('heading', { name: 'Scheduled Agents' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No scheduled agents yet' })).toBeInTheDocument()
    expect(screen.getByText(/click "Schedule" to set it to run automatically/)).toBeInTheDocument()
  })

  it('requests notification permission from the default banner', () => {
    vi.stubGlobal('Notification', { permission: 'default', requestPermission })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Enable notifications' }))
    expect(requestPermission).toHaveBeenCalledTimes(1)
  })

  it('renders the blocked state when permission is denied', () => {
    vi.stubGlobal('Notification', { permission: 'denied', requestPermission })
    renderPage()
    expect(screen.getByText('Notifications blocked')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Enable notifications' })).not.toBeInTheDocument()
  })

  it('omits notification controls when the browser has no API', () => {
    if ('Notification' in window) delete window.Notification
    renderPage()
    expect(screen.queryByText('Enable notifications')).not.toBeInTheDocument()
    expect(screen.queryByText('Notifications blocked')).not.toBeInTheDocument()
  })
})
