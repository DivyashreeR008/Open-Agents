import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import RecentRuns from './RecentRuns'

const now = new Date('2026-01-01T12:00:00.000Z').getTime()

function makeRun(overrides = {}) {
  return {
    id: 'run-1',
    agentName: 'Research Agent',
    provider: 'gemini-2.5-flash',
    output: 'Summary.',
    timestamp: now - 30_000,
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(now)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('RecentRuns Gemini provider marker', () => {
  it('uses the neutral dot for Gemini and Google provider names', () => {
    const { container } = render(
      <RecentRuns
        history={[makeRun(), makeRun({ id: 'run-2', provider: 'google-gemini' })]}
        onRerun={vi.fn()}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onClearAll={vi.fn()}
      />
    )

    const dots = [...container.querySelectorAll('article .h-1\\.5')]
    expect(dots).toHaveLength(2)
    expect(dots[0].className).toContain('bg-zinc-500')
    expect(dots[1].className).toContain('bg-zinc-500')
  })
})
