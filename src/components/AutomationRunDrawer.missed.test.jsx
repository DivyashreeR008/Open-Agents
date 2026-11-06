import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./OutputRenderer', () => ({ default: () => null }))

import AutomationRunDrawer from './AutomationRunDrawer'

const base = {
  id: 'r1',
  status: 'success',
  automationName: 'Daily digest',
  agentName: 'Summarizer',
  startedAt: 1700000000000,
  duration: 1500,
  tokens: 120,
  output: 'Hello output',
  emailSent: false,
}

function renderRun(run) {
  return render(<AutomationRunDrawer run={run} isOpen onClose={() => {}} />)
}

describe('AutomationRunDrawer unexecuted runs', () => {
  it('renders the missed explanation without execution metrics', () => {
    renderRun({ ...base, status: 'missed', output: '', scheduledFor: 1700000000000 })
    expect(screen.getByRole('heading', { name: 'Scheduled Run Details' })).toBeInTheDocument()
    expect(screen.getByText(/Nothing was sent to the model provider/)).toBeInTheDocument()
    expect(screen.queryByText('Duration')).not.toBeInTheDocument()
    expect(screen.queryByText('Est. Tokens')).not.toBeInTheDocument()
  })

  it('renders the skipped explanation', () => {
    renderRun({ ...base, status: 'skipped', output: '' })
    expect(screen.getByRole('heading', { name: 'Scheduled Run Details' })).toBeInTheDocument()
    expect(screen.getByText(/Nothing was sent to the model provider/)).toBeInTheDocument()
  })

  it('renders the catch-up note for a normal run', () => {
    renderRun({ ...base, catchUp: true, scheduledFor: 1700000000000 })
    expect(screen.getByText(/This was a catch-up run/)).toBeInTheDocument()
    expect(screen.getByText(/It ran late because the app was not open then/)).toBeInTheDocument()
  })

  it('does not render the catch-up note for a normal run', () => {
    renderRun(base)
    expect(screen.queryByText(/This was a catch-up run/)).not.toBeInTheDocument()
  })
})
