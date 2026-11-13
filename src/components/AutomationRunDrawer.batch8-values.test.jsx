import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

vi.mock('./OutputRenderer', () => ({ default: () => null }))

import AutomationRunDrawer from './AutomationRunDrawer'

const base = {
  id: 'r1',
  status: 'success',
  automationName: 'Daily digest',
  agentName: 'Summarizer',
  output: 'Hello output',
}

function renderRun(run = base) {
  return render(<AutomationRunDrawer run={run} isOpen onClose={() => {}} />)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AutomationRunDrawer missing timing and copy failures', () => {
  it('shows absent timing instead of NaN or Invalid Date', () => {
    renderRun({ ...base, duration: undefined, startedAt: 'not-a-date' })

    expect(screen.getByText('Duration').nextSibling).toHaveTextContent('—')
    expect(screen.getByText('Started At').nextSibling).toHaveTextContent('—')
    expect(screen.queryByText('NaN.00s')).not.toBeInTheDocument()
  })

  it('keeps a genuine zero duration distinct from missing timing', () => {
    renderRun({ ...base, duration: 0, startedAt: 1700000000000 })

    expect(screen.getByText('0.00s')).toBeInTheDocument()
  })

  it('surfaces a clipboard failure instead of showing success', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    renderRun()

    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'Copy failed. Select the output text and copy it manually.'
      )
    })
  })
})
