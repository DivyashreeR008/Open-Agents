import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AutomationRunDrawer from './AutomationRunDrawer'
import { expectNoA11yViolations } from '../test/a11y'

vi.mock('./OutputRenderer', () => ({ default: ({ content }) => <div>{content}</div> }))

const run = {
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

describe('AutomationRunDrawer dialog', () => {
  it('renders nothing when closed', () => {
    render(<AutomationRunDrawer run={run} isOpen={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('announces itself as a modal dialog, takes focus and closes on Escape', async () => {
    const onClose = vi.fn()
    const { container } = render(<AutomationRunDrawer run={run} isOpen onClose={onClose} />)
    const dialog = screen.getByRole('dialog', { name: /Run Execution Details/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: /close run details/i })).toHaveFocus()
    await expectNoA11yViolations(container)
    fireEvent.keyDown(document.activeElement, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('gives focus back to the opener on close', () => {
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    opener.focus()
    const { rerender } = render(<AutomationRunDrawer run={run} isOpen onClose={() => {}} />)
    rerender(<AutomationRunDrawer run={null} isOpen={false} onClose={() => {}} />)
    expect(opener).toHaveFocus()
    opener.remove()
  })
})
