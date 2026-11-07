import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CostEstimator from './CostEstimator'

describe('CostEstimator system prompt accounting', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts the system prompt as input tokens', () => {
    render(<CostEstimator inputText="" systemPrompt={'s'.repeat(400)} modelId="gpt-4o" />)
    act(() => vi.advanceTimersByTime(300))

    const input = screen.getByText(/Input \(\d+ tokens\)/)
    expect(input.textContent).not.toBe('Input (0 tokens)')
    expect(input.textContent).toMatch(/Input \(\d{2,} tokens\)/)
  })
})
