import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import TraceViewer from './TraceViewer'

describe('TraceViewer zero-duration segment', () => {
  it('keeps a zero-width segment for a step with no measured duration', () => {
    render(
      <TraceViewer
        trace={{
          steps: [
            { stepName: 'Plan', status: 'done', durationMs: 1000 },
            { stepName: 'Cache hit', status: 'done', durationMs: 0 },
          ],
        }}
      />
    )

    const segment = screen.getByLabelText('Cache hit: 0ms')
    expect(segment).toHaveStyle({ width: '0%', flexGrow: '0' })
  })
})
