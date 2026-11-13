import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RecentRuns from './RecentRuns'

const clearAnalyticsEvents = vi.hoisted(() => vi.fn(() => true))
vi.mock('../lib/useAnalytics', () => ({ clearAnalyticsEvents }))

const run = {
  id: 'run-1',
  agentName: 'Code Reviewer',
  provider: 'OpenAI',
  output: 'Looks good.',
  timestamp: Date.now(),
}

beforeEach(() => {
  clearAnalyticsEvents.mockClear()
})

describe('RecentRuns clear history options', () => {
  it('clears analytics usage records by default alongside history', () => {
    const onClearAll = vi.fn()
    render(<RecentRuns history={[run]} onClearAll={onClearAll} />)

    fireEvent.click(screen.getByRole('button', { name: 'Clear all history' }))
    const checkbox = screen.getByRole('checkbox', { name: /Also clear analytics usage records/ })
    expect(checkbox).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))

    expect(onClearAll).toHaveBeenCalledTimes(1)
    expect(clearAnalyticsEvents).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent(
      'Run history and analytics usage records cleared.'
    )
  })

  it('keeps analytics records when the user explicitly unchecks the option', () => {
    const onClearAll = vi.fn()
    render(<RecentRuns history={[run]} onClearAll={onClearAll} />)

    fireEvent.click(screen.getByRole('button', { name: 'Clear all history' }))
    fireEvent.click(screen.getByRole('checkbox', { name: /Also clear analytics usage records/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))

    expect(onClearAll).toHaveBeenCalledTimes(1)
    expect(clearAnalyticsEvents).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Run history cleared. Analytics usage records were kept.'
    )
  })
})
