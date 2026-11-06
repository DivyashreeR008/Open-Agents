import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('./OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))

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

const originalClipboard = navigator.clipboard

function renderRun(run = base, props = {}) {
  return render(<AutomationRunDrawer run={run} isOpen onClose={vi.fn()} {...props} />)
}

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
  if (originalClipboard === undefined) {
    delete navigator.clipboard
  } else {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    })
  }
})

describe('AutomationRunDrawer running and cleanup edges', () => {
  it('renders a running run with the spinner, zero duration, and no output', () => {
    const { container } = renderRun({
      ...base,
      status: 'running',
      duration: 0,
      tokens: 0,
      output: '',
      emailSent: false,
    })

    expect(screen.getByRole('heading', { name: 'Run Execution Details' })).toBeInTheDocument()
    expect(screen.getByText('running')).toBeInTheDocument()
    expect(screen.getByText('0.00s')).toBeInTheDocument()
    expect(container.querySelector('.animate-spin')).not.toBeNull()
    expect(screen.getByText('No output generated for this run.')).toBeInTheDocument()
  })

  it('copies an empty string when a run has neither output nor error', () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    renderRun({ ...base, output: undefined, error: undefined })

    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }))

    expect(writeText).toHaveBeenCalledOnce()
    expect(writeText).toHaveBeenCalledWith('')
  })

  it('closes on Escape from an action and removes the handler on unmount', () => {
    const opener = document.createElement('button')
    opener.textContent = 'Open run'
    document.body.appendChild(opener)
    opener.focus()

    const onClose = vi.fn()
    const { unmount } = renderRun(base, { onClose })
    const copyButton = screen.getByRole('button', { name: 'Copy output' })
    copyButton.focus()

    fireEvent.keyDown(copyButton, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    unmount()
    expect(opener).toHaveFocus()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    opener.remove()
  })
})
