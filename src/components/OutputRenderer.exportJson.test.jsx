import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

const createObjectURL = vi.fn(() => 'blob:json-log')
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

describe('OutputRenderer structured run log export', () => {
  it('serialises object output without losing nested values', async () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(
      <OutputRenderer
        content={{ verdict: 'pass', findings: [{ id: 7, severity: 'low' }] }}
        outputType="json"
        agentName="Audit Agent"
        systemPrompt="Audit the schema."
        userMessage="Check table users."
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Export JSON/i }))

    const blob = createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('application/json;charset=utf-8')
    const log = JSON.parse(await blob.text())
    expect(log).toMatchObject({
      agentName: 'Audit Agent',
      systemPrompt: 'Audit the schema.',
      inputs: 'Check table users.',
      output: { verdict: 'pass', findings: [{ id: 7, severity: 'low' }] },
    })
    expect(new Date(log.timestamp).toISOString()).toBe(log.timestamp)

    const downloadName = HTMLAnchorElement.prototype.click.mock.instances[0].download
    expect(downloadName).toBe('audit_agent_run_log.json')

    act(() => vi.advanceTimersByTime(1000))
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:json-log')
  })

  it('uses neutral defaults for an unnamed run with no prompts', async () => {
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(<OutputRenderer content="Plain" outputType="text" />)

    fireEvent.click(screen.getByRole('button', { name: /Export JSON/i }))

    const log = JSON.parse(await createObjectURL.mock.calls[0][0].text())
    expect(log).toMatchObject({
      agentName: 'Agent',
      systemPrompt: '',
      inputs: '',
      output: 'Plain',
    })

    act(() => vi.advanceTimersByTime(1000))
    expect(revokeObjectURL).toHaveBeenCalled()
  })
})
