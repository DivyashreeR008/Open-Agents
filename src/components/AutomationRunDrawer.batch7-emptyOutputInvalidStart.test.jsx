import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

vi.mock('./OutputRenderer', () => ({ default: () => null }))

import AutomationRunDrawer from './AutomationRunDrawer'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AutomationRunDrawer empty output downloads', () => {
  it('writes an empty file and uses today when the start time is invalid', async () => {
    let blob
    vi.spyOn(URL, 'createObjectURL').mockImplementation((value) => {
      blob = value
      return 'blob:empty-run'
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const downloadSpy = vi.spyOn(HTMLAnchorElement.prototype, 'download', 'set')

    render(
      <AutomationRunDrawer
        run={{
          id: 'r1',
          status: 'success',
          agentName: 'Worker',
          duration: 0,
          startedAt: 'not-a-date',
        }}
        isOpen
        onClose={() => {}}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Download markdown' }))

    expect(await blob.text()).toBe('')
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
    const today = new Date().toISOString().split('T')[0]
    expect(downloadSpy.mock.calls.at(-1)[0]).toBe('run_' + today + '.md')
  })
})
