import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import AgentActivity from './AgentActivity'
import { ACTIVITY_EVENT } from '../lib/agentActivity'

const put = (key, value) => localStorage.setItem(key, JSON.stringify(value))
async function openPanel() {
  const view = render(<AgentActivity agentId="a" />)
  const details = view.container.querySelector('details')
  details.open = true
  fireEvent(details, new Event('toggle'))
  await screen.findByText(/Manual and scheduled runs are shown together/)
  return view
}
beforeEach(() => localStorage.clear())

describe('agent activity view', () => {
  it('opens original outputs from both sources and shows trigger provenance', async () => {
    put('OpenAgents_history', [
      { id: 'same', agentId: 'a', timestamp: 10, output: '<img src=x onerror=alert(1)>' },
    ])
    put('oa_automation_runs_v2', [
      {
        id: 'same',
        agentId: 'a',
        trigger: 'scheduled',
        startedAt: 20,
        output: 'Nightly output',
        status: 'success',
      },
    ])
    await openPanel()
    fireEvent.click(screen.getByRole('button', { name: /Scheduled.*Automation history.*Run same/ }))
    expect(
      screen.getByRole('region', { name: 'Run details: Automation history same' })
    ).toHaveTextContent('Nightly output')
    fireEvent.click(screen.getByRole('button', { name: /Manual.*Recent runs.*Run same/ }))
    expect(screen.getByRole('region', { name: 'Run details: Recent runs same' })).toHaveTextContent(
      '<img src=x onerror=alert(1)>'
    )
    expect(document.querySelector('img')).toBeNull()
  })

  it('updates after same-tab and cross-tab writes and removes deleted details', async () => {
    await openPanel()
    expect(screen.getByText('No retained activity for this agent.')).toBeInTheDocument()
    put('oa_scheduler_results', [
      { id: 'late', agentId: 'a', ranAt: 10, error: 'Provider failed', output: '' },
    ])
    act(() => window.dispatchEvent(new Event(ACTIVITY_EVENT)))
    fireEvent.click(
      await screen.findByRole('button', { name: /Unknown trigger.*Scheduler history.*Run late/ })
    )
    expect(
      screen.getByRole('region', { name: 'Run details: Scheduler history late' })
    ).toHaveTextContent('Provider failed')
    localStorage.removeItem('oa_scheduler_results')
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'oa_scheduler_results' })))
    expect(screen.queryByRole('region')).toBeNull()
  })

  it('pages retained results without changing their storage', async () => {
    const records = Array.from({ length: 25 }, (_, i) => ({
      id: String(i),
      agentId: 'a',
      timestamp: i + 1,
    }))
    put('oa_automation_runs_v2', records)
    await openPanel()
    expect(screen.getAllByRole('listitem')).toHaveLength(20)
    fireEvent.click(screen.getByRole('button', { name: 'Show more activity' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(25)
    expect(JSON.parse(localStorage.getItem('oa_automation_runs_v2'))).toEqual(records)
  })

  it('shows partial-read warnings and can retry after storage is repaired', async () => {
    localStorage.setItem('OpenAgents_history', '{bad')
    await openPanel()
    expect(screen.getByRole('alert')).toHaveTextContent('list may be incomplete')
    put('OpenAgents_history', [{ id: 'recovered', agentId: 'a' }])
    fireEvent.click(screen.getByRole('button', { name: 'Retry reading activity' }))
    expect(screen.queryByRole('alert')).toBeNull()
    expect(
      screen.getByRole('button', { name: /Time unavailable.*Run recovered/ })
    ).toBeInTheDocument()
  })
})
