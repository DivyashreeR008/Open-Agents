import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CostEstimator from './CostEstimator'

describe('CostEstimator output projection cap', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('never projects more than 4096 output tokens for a huge prompt', () => {
    render(<CostEstimator inputText={'x'.repeat(200000)} modelId="gpt-4o" />)
    act(() => vi.advanceTimersByTime(300))

    expect(screen.getByText(/Output \(~4,096 tokens est\.\)/)).toBeInTheDocument()
    expect(screen.queryByText(/Output \(~50,000/)).not.toBeInTheDocument()
  })
})
