import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TraceViewer from './TraceViewer'

describe('TraceViewer step accordion payloads', () => {
  it('opens a successful step and hides an empty input payload', () => {
    render(
      <TraceViewer
        trace={{
          steps: [
            {
              stepName: 'Summarize findings',
              stepType: 'agent',
              status: 'done',
              durationMs: 1200,
              input: null,
              output: 'Three findings were extracted.',
            },
          ],
        }}
      />
    )

    const toggle = screen.getByRole('button', { name: /Summarize findings/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText('Input payload, scrollable')).not.toBeInTheDocument()

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText('Output payload, scrollable')).toHaveTextContent(
      'Three findings were extracted.'
    )
    expect(screen.queryByLabelText('Input payload, scrollable')).not.toBeInTheDocument()

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
