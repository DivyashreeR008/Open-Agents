import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TraceViewer from './TraceViewer'

describe('TraceViewer empty trace handling', () => {
  it('shows the empty message for a missing trace and for a trace without steps', () => {
    const { rerender } = render(<TraceViewer trace={null} />)
    expect(screen.getByText('No trace recorded for this run yet.')).toBeInTheDocument()

    rerender(<TraceViewer trace={{ steps: [] }} />)
    expect(screen.getByText('No trace recorded for this run yet.')).toBeInTheDocument()
  })

  it('does not render a timeline when no step produced timing data', () => {
    render(<TraceViewer trace={{ steps: [{ stepName: 'Plan', status: 'done' }] }} />)
    expect(screen.getByText('Plan')).toBeInTheDocument()
    expect(screen.getByText('Timeline')).toBeInTheDocument()
    expect(screen.getByText(/Total 0ms/)).toBeInTheDocument()
  })
})
