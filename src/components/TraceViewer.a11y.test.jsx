import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TraceViewer from './TraceViewer'

const trace = {
  steps: [
    { stepName: 'Plan', status: 'done', durationMs: 1200 },
    { stepName: 'Write', status: 'done', durationMs: 800 },
  ],
}

describe('TraceViewer timeline segments', () => {
  it('are keyboard focusable with an accessible name', () => {
    render(<TraceViewer trace={trace} />)
    const seg = screen.getAllByRole('img').find((el) => el.getAttribute('aria-label')?.startsWith('Plan'))
    expect(seg).toHaveAttribute('tabindex', '0')
  })

  it('shows the step duration as visible text on focus', async () => {
    const user = userEvent.setup()
    render(<TraceViewer trace={trace} />)
    await user.tab()
    const live = document.querySelector('[aria-live="polite"]')
    expect(live.textContent).toMatch(/^Plan:/)
  })

  it('shows the step duration on tap/click', async () => {
    const user = userEvent.setup()
    render(<TraceViewer trace={trace} />)
    const seg = screen.getAllByRole('img').find((el) => el.getAttribute('aria-label')?.startsWith('Write'))
    await user.click(seg)
    expect(document.querySelector('[aria-live="polite"]').textContent).toMatch(/^Write:/)
  })
})
