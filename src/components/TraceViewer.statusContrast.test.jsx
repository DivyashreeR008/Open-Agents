import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TraceViewer from './TraceViewer'

describe('TraceViewer status vocabulary', () => {
  it('labels completed, failed, and running steps without relying on color', () => {
    render(
      <TraceViewer
        trace={{
          steps: [
            { stepName: 'Plan', stepType: 'llm', status: 'done', durationMs: 10 },
            { stepName: 'Write', stepType: 'llm', status: 'failed', durationMs: 20, error: 'Nope' },
            { stepName: 'Review', stepType: 'llm', status: 'running', durationMs: 30 },
          ],
        }}
      />
    )

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toHaveClass('text-red-800')
    expect(screen.getByText('Nope')).toHaveClass('text-red-800/90')
    expect(screen.getByLabelText('Plan: 10ms').className).toContain('bg-emerald-500/80')
    expect(screen.getByLabelText('Write: 20ms').className).toContain('bg-red-500')
    expect(screen.getByLabelText('Review: 30ms').className).toContain('bg-amber-500')
  })
})
