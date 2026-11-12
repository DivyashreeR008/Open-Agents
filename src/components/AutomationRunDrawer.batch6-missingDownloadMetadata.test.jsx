import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('./OutputRenderer', () => ({ default: () => null }))

import AutomationRunDrawer from './AutomationRunDrawer'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AutomationRunDrawer download metadata', () => {
  it('falls back to a safe filename when the run has no name or start time', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:run')
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(
      <AutomationRunDrawer
        run={{ id: 'r1', status: 'success', agentName: 'Worker', duration: 0, output: 'text' }}
        isOpen
        onClose={() => {}}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Download markdown' }))
    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
  })
})
