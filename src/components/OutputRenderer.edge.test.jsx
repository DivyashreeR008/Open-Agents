import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

const writeText = vi.fn()
const createObjectURL = vi.fn(() => 'blob:mock-url')
const revokeObjectURL = vi.fn()

beforeEach(() => {
  writeText.mockReset()
  createObjectURL.mockClear()
  revokeObjectURL.mockClear()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
  Object.defineProperty(URL, 'createObjectURL', {
    value: createObjectURL,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(URL, 'revokeObjectURL', {
    value: revokeObjectURL,
    configurable: true,
    writable: true,
  })
  document.execCommand = vi.fn(() => false)
})

afterEach(() => {
  vi.useRealTimers()
  delete document.execCommand
})

describe('OutputRenderer empty and fallback states', () => {
  it('renders nothing for empty, null, or undefined content', () => {
    const { container, rerender } = render(
      <OutputRenderer content="" outputType="text" agentName="t" />
    )
    expect(container).toBeEmptyDOMElement()

    rerender(<OutputRenderer content={null} outputType="text" agentName="t" />)
    expect(container).toBeEmptyDOMElement()

    rerender(<OutputRenderer content={undefined} outputType="text" agentName="t" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('falls back to execCommand, cleans up the textarea, and reports a failed copy', async () => {
    writeText.mockRejectedValue(new Error('Clipboard denied'))
    document.execCommand.mockReturnValue(false)
    render(<OutputRenderer content="copy me" outputType="text" agentName="t" />)

    fireEvent.click(screen.getByRole('button', { name: /Copy output/i }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Copy output failed/i })).toBeInTheDocument()
    )
    expect(screen.getByText('Copy failed. Select the output and press Ctrl+C.')).toBeInTheDocument()
    expect(document.querySelector('textarea[readonly]')).toBeNull()

    document.execCommand.mockReturnValue(true)
    fireEvent.click(screen.getByRole('button', { name: /Copy output failed/i }))

    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument())
    expect(screen.getByText('Copy output copied to clipboard.')).toBeInTheDocument()
    expect(document.querySelector('textarea[readonly]')).toBeNull()
  })

  it('does not render raw HTML or executable URLs from markdown output', () => {
    const markdown = [
      '# Safe heading',
      '',
      '<script>window.__danger = 1</script>',
      '',
      '<img src="x" onerror="window.__danger = 2">',
      '',
      '[unsafe](javascript:alert(1))',
      '',
      'Visible sentence.',
    ].join('\n')

    render(<OutputRenderer content={markdown} outputType="markdown" agentName="t" />)

    expect(screen.getByRole('heading', { name: 'Safe heading' })).toBeInTheDocument()
    expect(screen.getByText('Visible sentence.')).toBeInTheDocument()
    expect(document.querySelector('script')).toBeNull()
    expect(document.querySelector('img')).toBeNull()
    expect(window.__danger).toBeUndefined()
    expect(screen.queryByRole('link', { name: 'unsafe' })?.getAttribute('href') || '').not.toMatch(
      /^javascript:/i
    )
  })

  it('downloads raw output with the matching extension and revokes the URL after cleanup', async () => {
    vi.useFakeTimers()
    const downloads = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function captureDownload() {
      downloads.push(this.download)
    })

    const { rerender } = render(
      <OutputRenderer content="Output body" outputType="markdown" agentName="My Agent" />
    )

    fireEvent.click(screen.getByRole('button', { name: /Export Output/i }))
    expect(downloads).toEqual(['my_agent_output.md'])
    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob)
    expect(await createObjectURL.mock.calls[0][0].text()).toBe('Output body')
    expect(revokeObjectURL).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1000))
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')

    rerender(<OutputRenderer content="Plain body" outputType="text" agentName="My Agent" />)
    fireEvent.click(screen.getByRole('button', { name: /Export Output/i }))
    expect(downloads).toEqual(['my_agent_output.md', 'my_agent_output.txt'])
    expect(await createObjectURL.mock.calls[1][0].text()).toBe('Plain body')

    act(() => vi.advanceTimersByTime(1000))
    expect(revokeObjectURL).toHaveBeenCalledTimes(2)
  })
})
