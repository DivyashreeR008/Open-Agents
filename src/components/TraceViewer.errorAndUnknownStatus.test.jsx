import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TraceViewer from './TraceViewer'

describe('TraceViewer failed and unknown step states', () => {
  it('shows a failed step error and gives an unknown status a neutral timeline segment', () => {
    render(
      <TraceViewer
        trace={{
          steps: [
            {
              stepName: 'Plan',
              stepType: 'llm',
              status: 'failed',
              durationMs: 1200,
              error: 'Provider exploded',
              input: 'brief',
              output: '',
            },
            {
              stepName: 'Draft',
              stepType: 'tool',
              status: 'queued',
              durationMs: 300,
            },
          ],
        }}
      />
    )

    expect(screen.getByText('Provider exploded')).toBeInTheDocument()
    expect(screen.getByLabelText('Draft: 300ms')).toBeInTheDocument()
    expect(screen.getByLabelText('Plan: 1.2s')).toBeInTheDocument()
  })
})
