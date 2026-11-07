import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

const writeText = vi.fn()

beforeEach(() => {
  writeText.mockReset()
  writeText.mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
})

describe('OutputRenderer object content and sharing', () => {
  it('pretty prints object content and shares a labelled transcript', async () => {
    const output = { verdict: 'pass', nested: { score: 9 } }
    render(<OutputRenderer content={output} outputType="text" agentName="QA Agent" />)

    expect(screen.getByText(/"verdict": "pass"/)).toBeInTheDocument()
    expect(screen.getByText(/"score": 9/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Share$/i }))

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(writeText).toHaveBeenCalledWith(
      '--- Agent: QA Agent ---\n\n--- Output ---\n' + JSON.stringify(output, null, 2)
    )
    expect(await screen.findByText('Share copied to clipboard.')).toBeInTheDocument()
  })

  it('renders structured scorecard data for json output', () => {
    render(
      <OutputRenderer
        content={{ matchScore: 82, recommendation: 'Yes', summary: 'Strong fit.' }}
        outputType="json"
        agentName="Screener"
      />
    )

    expect(screen.getByText('Match Score')).toBeInTheDocument()
    expect(screen.getByText('82')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
  })
})
