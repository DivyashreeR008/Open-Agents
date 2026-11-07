import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('OutputRenderer printable export', () => {
  it('opens a print view with escaped content and triggers print after layout', () => {
    const printWindow = {
      document: {
        write: vi.fn(),
        close: vi.fn(),
      },
      focus: vi.fn(),
      print: vi.fn(),
    }
    const open = vi.spyOn(window, 'open').mockReturnValue(printWindow)
    render(
      <OutputRenderer content={'<b>bold</b> & "quoted"'} outputType="text" agentName="Reviewer" />
    )

    fireEvent.click(screen.getByRole('button', { name: /Export PDF/i }))

    expect(open).toHaveBeenCalledWith('', '_blank', 'width=900,height=700')
    expect(printWindow.document.write).toHaveBeenCalledTimes(1)
    const html = printWindow.document.write.mock.calls[0][0]
    expect(html).toContain('<title>Reviewer</title>')
    expect(html).toContain('&lt;b&gt;bold&lt;/b&gt; &amp; &quot;quoted&quot;')
    expect(html).not.toContain('<b>bold</b>')
    expect(printWindow.document.close).toHaveBeenCalled()
    expect(printWindow.focus).toHaveBeenCalled()
    expect(printWindow.print).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(250))
    expect(printWindow.print).toHaveBeenCalledTimes(1)
  })

  it('does nothing when the browser blocks the popup', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    render(<OutputRenderer content="No popup" outputType="text" agentName="Reviewer" />)

    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: /Export PDF/i }))
    }).not.toThrow()

    act(() => vi.advanceTimersByTime(250))
    expect(open).toHaveBeenCalled()
  })
})
