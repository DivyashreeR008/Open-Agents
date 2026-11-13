import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

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

function renderRun(run = base) {
  return render(<AutomationRunDrawer run={run} isOpen onClose={() => {}} />)
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('AutomationRunDrawer actions', () => {
  it('copies the output and falls back to the error', () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    const first = renderRun()
    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }))
    expect(writeText).toHaveBeenLastCalledWith('Hello output')

    first.unmount()
    writeText.mockClear()
    renderRun({ ...base, output: '', error: 'Boom' })
    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }))
    expect(writeText).toHaveBeenLastCalledWith('Boom')
  })

  it('downloads a markdown file with a normalized name and revokes the URL', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:run')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    renderRun()

    fireEvent.click(screen.getByRole('button', { name: 'Download markdown' }))

    expect(createObjectURL).toHaveBeenCalledOnce()
    const blob = createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('text/markdown')
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:run')
    expect(click).toHaveBeenCalledOnce()
    expect(document.querySelector('a[download="Daily_digest_2023-11-14.md"]')).toBeNull()
  })

  it('clears the copied state after the timeout', () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    vi.useFakeTimers()
    const { container } = renderRun()
    const button = screen.getByRole('button', { name: 'Copy output' })
    expect(container.querySelector('.lucide-check')).toBeNull()
    fireEvent.click(button)
    expect(writeText).toHaveBeenCalledOnce()
  })
})
