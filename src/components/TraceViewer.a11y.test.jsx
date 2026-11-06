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

describe('TraceViewer payload regions', () => {
  it('makes tall input and output payloads keyboard-scrollable and named', () => {
    const failed = {
      steps: [
        {
          stepName: 'Inspect',
          stepType: 'tool',
          status: 'failed',
          durationMs: 25,
          input: 'source line\n'.repeat(20),
          output: 'stack line\n'.repeat(20),
        },
      ],
    }
    render(<TraceViewer trace={failed} />)

    const input = screen.getByRole('region', { name: 'Input payload, scrollable' })
    const output = screen.getByRole('region', { name: 'Output payload, scrollable' })

    expect(input).toHaveAttribute('tabindex', '0')
    expect(output).toHaveAttribute('tabindex', '0')
    expect(output).toHaveClass('overflow-y-auto')

    output.focus()
    expect(output).toHaveFocus()
  })
})
