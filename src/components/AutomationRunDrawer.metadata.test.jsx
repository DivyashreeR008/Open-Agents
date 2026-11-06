import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('./OutputRenderer', () => ({
  default: ({ content }) => <div data-testid="output">{content}</div>,
}))

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
  emailSent: true,
}

function renderRun(run = base) {
  return render(<AutomationRunDrawer run={run} isOpen onClose={() => {}} />)
}

describe('AutomationRunDrawer metadata', () => {
  it('renders status, duration, tokens, start time, and email delivery', () => {
    renderRun()
    expect(screen.getByRole('dialog', { name: /Run Execution Details/ })).toBeInTheDocument()
    expect(screen.getByText('success')).toBeInTheDocument()
    expect(screen.getByText('1.50s')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('Delivered')).toBeInTheDocument()
    expect(screen.getByText(/Daily digest.*Summarizer/)).toBeInTheDocument()
  })

  it('uses placeholders for a missing token count and disabled email', () => {
    renderRun({ ...base, tokens: undefined, emailSent: false })
    expect(screen.getByText('\u2014')).toBeInTheDocument()
    expect(screen.getByText('Disabled/None')).toBeInTheDocument()
  })

  it('renders a failed run with diagnostics and no output renderer', () => {
    renderRun({ ...base, status: 'error', output: '', error: 'Provider returned 429' })
    expect(screen.getByText('Execution Error Diagnostics')).toBeInTheDocument()
    expect(screen.getByText('Provider returned 429')).toBeInTheDocument()
    expect(screen.getByText('Empty')).toBeInTheDocument()
    expect(screen.getByText('No output generated for this run.')).toBeInTheDocument()
    expect(screen.queryByTestId('output')).not.toBeInTheDocument()
  })

  it('renders the output character count and the output renderer', () => {
    renderRun()
    expect(screen.getByText('12 characters')).toBeInTheDocument()
    expect(screen.getByTestId('output')).toHaveTextContent('Hello output')
  })
})
