import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import RecentRuns from './RecentRuns'

describe('RecentRuns missing history', () => {
  it('treats an undefined history prop as an empty list', () => {
    render(
      <RecentRuns onRerun={vi.fn()} onCopy={vi.fn()} onDelete={vi.fn()} onClearAll={vi.fn()} />
    )

    expect(screen.getByText('Runs you start will show up here.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear all history' })).not.toBeInTheDocument()
  })
})
