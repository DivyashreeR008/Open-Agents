import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

const createObjectURL = vi.fn(() => 'blob:txt-log')
const revokeObjectURL = vi.fn()

beforeEach(() => {
  vi.useFakeTimers()
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
  vi.restoreAllMocks()
})

describe('OutputRenderer full run log export', () => {
  it('writes the prompts, inputs, and output into a timestamped text log', async () => {
    const downloads = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function captureDownload() {
      downloads.push(this.download)
    })
    render(
      <OutputRenderer
        content="Final answer"
        outputType="text"
        agentName="Research Agent"
        systemPrompt="Cite every source."
        userMessage="Summarise the paper."
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Export TXT/i }))

    expect(downloads).toEqual(['research_agent_run_log.txt'])
    expect(createObjectURL).toHaveBeenCalledTimes(1)
    const blob = createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('text/plain;charset=utf-8')
    const text = await blob.text()
    expect(text).toContain('AGENT RUN LOG: Research Agent')
    expect(text).toContain('--- System Prompt ---\nCite every source.')
    expect(text).toContain('--- User Inputs ---\nSummarise the paper.')
    expect(text).toContain('--- Output ---\nFinal answer')
    expect(text).toMatch(/Timestamp: \d{4}-\d{2}-\d{2}T/)
    expect(revokeObjectURL).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(1000))
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:txt-log')
  })
})
