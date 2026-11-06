import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AutomationDetailPage from './AutomationDetailPage'
import AutomationsPage from './AutomationsPage'
import AutomationRunDrawer from '../components/AutomationRunDrawer'
import CreateAutomationModal from '../components/CreateAutomationModal'

const service = vi.hoisted(() => ({ updateAutomation: vi.fn(), createAutomation: vi.fn() }))

vi.mock('../components/OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))
vi.mock('../lib/useAgents', () => ({ useAgents: () => ({ agents: [] }) }))
vi.mock('../lib/useApiKey', () => ({ useApiKey: () => ({ apiKey: '' }) }))
vi.mock('../lib/automationsService', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // the page starts the engine on mount; these tests only look at what is stored
    initAutomationEngine: vi.fn(),
    updateAutomation: (...args) => service.updateAutomation(...args),
    createAutomation: (...args) => service.createAutomation(...args),
  }
})

const NOW = Date.UTC(2026, 10, 3, 12, 0, 0)
const DAY = 24 * 60 * 60 * 1000

const automation = (overrides = {}) => ({
  id: 'auto_1',
  name: 'Morning digest',
  agentId: 'a1',
  agentName: 'Summarizer',
  category: 'General',
  provider: 'openai',
  model: 'gpt-4o',
  schedule: 'daily',
  cron: '0 9 * * *',
  enabled: true,
  inputs: {},
  systemPrompt: '',
  emailNotification: false,
  notificationEmail: '',
  createdAt: NOW - 20 * DAY,
  lastRunAt: NOW - DAY,
  nextRunAt: NOW + DAY,
  hasKey: true,
  ...overrides,
})

const run = (overrides = {}) => ({
  id: `r_${Math.random()}`,
  automationId: 'auto_1',
  automationName: 'Morning digest',
  agentName: 'Summarizer',
  status: 'success',
  startedAt: NOW - DAY,
  completedAt: NOW - DAY + 2000,
  duration: 2000,
  tokens: 100,
  output: 'ok',
  error: null,
  emailSent: false,
  ...overrides,
})

const missedRecord = run({
  id: 'r_missed',
  status: 'missed',
  missedCount: 3,
  firstWindow: NOW - 4 * DAY,
  lastWindow: NOW - 2 * DAY,
  startedAt: NOW - 2 * DAY,
  detectedAt: NOW - 60_000,
  duration: 0,
  tokens: 0,
  output: '',
  policy: 'run_once',
})
const skippedRecord = run({
  id: 'r_skipped',
  status: 'skipped',
  skippedCount: 1,
  firstWindow: NOW - 3 * DAY,
  lastWindow: NOW - 3 * DAY,
  startedAt: NOW - 3 * DAY,
  detectedAt: NOW - 60_000,
  duration: 0,
  tokens: 0,
  output: '',
  reason: 'no_key',
})
const catchUpRun = run({
  id: 'r_catchup',
  startedAt: NOW - 60_000,
  scheduledFor: NOW - 2 * DAY,
  catchUp: true,
})

function seed(automations, runs) {
  localStorage.setItem('oa_automations_v2', JSON.stringify(automations))
  localStorage.setItem('oa_automation_runs_v2', JSON.stringify(runs))
}

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/automations/auto_1']}>
      <Routes>
        <Route path="/automations/:id" element={<AutomationDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
  service.updateAutomation.mockReset()
  service.createAutomation.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('automation history: ran, skipped and missed', () => {
  beforeEach(() => {
    seed(
      [automation()],
      [
        run({ id: 'r_ok' }),
        run({ id: 'r_bad', status: 'failed', error: 'x', output: '' }),
        catchUpRun,
        missedRecord,
        skippedRecord,
      ]
    )
  })

  it('shows how many runs ran, were skipped and were missed', () => {
    renderDetail()
    const summary = document.getElementById('history-summary')
    expect(summary).toHaveTextContent('3 ran')
    expect(summary).toHaveTextContent('1 skipped')
    expect(summary).toHaveTextContent('3 missed')
  })

  it('labels each kind of row, and what caused it', () => {
    renderDetail()
    const table = screen.getByRole('table')
    expect(within(table).getByText('missed')).toBeInTheDocument()
    expect(within(table).getByText('skipped')).toBeInTheDocument()
    expect(within(table).getAllByText('success').length).toBeGreaterThan(0)
    expect(within(table).getByText('failed')).toBeInTheDocument()
    expect(within(table).getByText('3 runs missed')).toBeInTheDocument()
    expect(within(table).getByText('1 run skipped')).toBeInTheDocument()
    expect(within(table).getByText('catch-up')).toBeInTheDocument()
    expect(within(table).getByText(/was due/)).toBeInTheDocument()
  })

  it('does not count missed or skipped windows as runs in the stats', () => {
    renderDetail()
    // 3 executed runs: success, success (catch-up) and failed
    const totalRuns = screen.getByText('Total Runs').nextElementSibling
    expect(totalRuns).toHaveTextContent('3')
    expect(screen.getByText('Success Rate').nextElementSibling).toHaveTextContent('67%')
    expect(screen.getByText(/Execution History \(5\)/)).toBeInTheDocument()
  })

  it('opens the details of a missed row without an output viewer', () => {
    renderDetail()
    fireEvent.click(screen.getByText('3 runs missed'))
    const dialog = screen.getByRole('dialog', { name: /Scheduled Run Details/i })
    expect(within(dialog).getByText(/while the app was not running/)).toBeInTheDocument()
    expect(within(dialog).queryByText('Generated Agent Output')).toBeNull()
  })

  it('shows the missed-run setting on the configuration tab', () => {
    seed([automation({ missedPolicy: 'skip' })], [])
    renderDetail()
    fireEvent.click(screen.getByText('Agent Configuration'))
    expect(document.getElementById('missed-policy')).toHaveTextContent('Skip missed runs')
  })

  it('falls back to run once for an automation saved before the setting existed', () => {
    renderDetail()
    fireEvent.click(screen.getByText('Agent Configuration'))
    expect(document.getElementById('missed-policy')).toHaveTextContent('Run once when I come back')
  })
})

describe('run drawer', () => {
  it('explains a catch-up run and still shows its output', () => {
    render(<AutomationRunDrawer run={catchUpRun} isOpen onClose={() => {}} />)
    expect(screen.getByText(/catch-up run for the window that was due/)).toBeInTheDocument()
    expect(screen.getByText('ok')).toBeInTheDocument()
  })

  it('explains skipped runs with the reason', () => {
    render(<AutomationRunDrawer run={skippedRecord} isOpen onClose={() => {}} />)
    expect(screen.getByRole('dialog', { name: /Scheduled Run Details/i })).toBeInTheDocument()
    expect(screen.getByText(/no API key is stored/)).toBeInTheDocument()
  })
})

describe('automations list', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <AutomationsPage />
      </MemoryRouter>
    )

  it('tells the user when runs were missed, and which automation', () => {
    seed([automation()], [run(), missedRecord])
    renderPage()
    const banner = document.getElementById('missed-runs-banner')
    expect(banner).toHaveTextContent('3 scheduled runs were missed across 1 automation')
    expect(screen.getByText('3 missed')).toBeInTheDocument() // badge on the automation's card
  })

  it('mentions skipped runs too', () => {
    seed([automation()], [missedRecord, skippedRecord])
    renderPage()
    expect(document.getElementById('missed-runs-banner')).toHaveTextContent('and 1 skipped')
  })

  it('stays out of the way when nothing was missed', () => {
    seed([automation()], [run()])
    renderPage()
    expect(document.getElementById('missed-runs-banner')).toBeNull()
  })

  it('can be dismissed, and stays dismissed', () => {
    seed([automation()], [missedRecord])
    const first = renderPage()
    fireEvent.click(screen.getByRole('button', { name: /dismiss missed runs notice/i }))
    expect(document.getElementById('missed-runs-banner')).toBeNull()
    first.unmount()

    renderPage()
    expect(document.getElementById('missed-runs-banner')).toBeNull()
  })

  it('only looks back a week', () => {
    seed([automation()], [{ ...missedRecord, detectedAt: NOW - 8 * DAY }])
    renderPage()
    expect(document.getElementById('missed-runs-banner')).toBeNull()
  })

  it('does not count missed or skipped windows in the run totals', () => {
    seed([automation()], [run(), run(), missedRecord, skippedRecord])
    renderPage()
    expect(screen.getByText('Recorded Runs').parentElement.nextElementSibling).toHaveTextContent(
      '2'
    )
    expect(screen.getByText('Success Rate').parentElement.nextElementSibling).toHaveTextContent(
      '100%'
    )
  })
})

describe('the missed-run setting in the create and edit form', () => {
  const agent = {
    id: 'a1',
    name: 'Summarizer',
    category: 'General',
    provider: 'openai',
    systemPrompt: '',
    inputs: [],
  }
  const openForm = (props) =>
    render(
      <CreateAutomationModal
        isOpen
        onClose={() => {}}
        onSuccess={() => {}}
        preselectedAgent={agent}
        {...props}
      />
    )

  it('defaults to what automations always did: run once', () => {
    openForm()
    expect(screen.getByLabelText('If runs are missed')).toHaveValue('run_once')
  })

  it('offers all three choices, with the catch-up limit named', () => {
    openForm()
    const select = screen.getByLabelText('If runs are missed')
    expect(
      within(select)
        .getAllByRole('option')
        .map((o) => o.textContent)
    ).toEqual(['Run once when I come back', 'Catch up (up to 3 runs)', 'Skip missed runs'])
  })

  it('creates an automation with the chosen setting', async () => {
    service.createAutomation.mockResolvedValue({})
    openForm({ initialData: null })
    fireEvent.change(screen.getByLabelText('Automation name'), { target: { value: 'Digest' } })
    fireEvent.change(screen.getByLabelText('If runs are missed'), { target: { value: 'catch_up' } })
    fireEvent.change(screen.getByLabelText('openai API key'), { target: { value: 'sk-123' } })
    fireEvent.click(screen.getAllByRole('checkbox')[1]) // email reports are on by default and need an address
    fireEvent.click(screen.getByRole('button', { name: /Activate Autopilot/i }))
    await vi.waitFor(() => expect(service.createAutomation).toHaveBeenCalled())
    expect(service.createAutomation.mock.calls[0][0]).toMatchObject({ missedPolicy: 'catch_up' })
  })

  it('shows the saved setting when editing and saves a change', async () => {
    service.updateAutomation.mockResolvedValue({})
    openForm({ initialData: automation({ missedPolicy: 'skip' }) })
    const select = screen.getByLabelText('If runs are missed')
    expect(select).toHaveValue('skip')
    fireEvent.change(select, { target: { value: 'run_once' } })
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }))
    await vi.waitFor(() => expect(service.updateAutomation).toHaveBeenCalled())
    expect(service.updateAutomation.mock.calls[0][1]).toMatchObject({ missedPolicy: 'run_once' })
  })

  it('treats an automation saved before the setting existed as run once', () => {
    openForm({ initialData: automation() })
    expect(screen.getByLabelText('If runs are missed')).toHaveValue('run_once')
  })
})
