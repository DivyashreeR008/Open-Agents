import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

const createObjectURL = vi.fn(() => 'blob:mock-url')
const revokeObjectURL = vi.fn()

beforeEach(() => {
  createObjectURL.mockClear()
  revokeObjectURL.mockClear()
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
})

afterEach(() => {
  vi.useRealTimers()
})

describe('OutputRenderer unnamed text export fallbacks', () => {
  it('uses neutral names and placeholders in a full run log', async () => {
    vi.useFakeTimers()
    const downloads = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function captureDownload() {
      downloads.push(this.download)
    })

    render(<OutputRenderer content="Body only" outputType="text" />)

    fireEvent.click(screen.getByRole('button', { name: /Export TXT/i }))

    expect(downloads).toEqual(['agent_run_log.txt'])
    const text = await createObjectURL.mock.calls[0][0].text()
    expect(text).toContain('AGENT RUN LOG: Agent')
    expect(text).toContain('--- System Prompt ---\nN/A')
    expect(text).toContain('--- User Inputs ---\nN/A')
    expect(text).toContain('--- Output ---\nBody only')
  })

  it('uses the generic agent prefix for a raw text download', async () => {
    vi.useFakeTimers()
    const downloads = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function captureDownload() {
      downloads.push(this.download)
    })

    render(<OutputRenderer content="Body only" outputType="text" />)

    fireEvent.click(screen.getByRole('button', { name: /Export Output/i }))

    expect(downloads).toEqual(['agent_output.txt'])
    expect(await createObjectURL.mock.calls[0][0].text()).toBe('Body only')
  })
})
