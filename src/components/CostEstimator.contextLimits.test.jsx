import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const pricing = vi.hoisted(() => ({
  getPricing: vi.fn(),
  getContextWindow: vi.fn(),
}))

vi.mock('../lib/modelPricing', () => pricing)
vi.mock('../lib/useTokenCounter', () => ({
  useTokenCounter: (text) => ({ tokens: text.length }),
}))

import CostEstimator from './CostEstimator'

beforeEach(() => {
  pricing.getPricing.mockReset()
  pricing.getContextWindow.mockReset()
  pricing.getPricing.mockReturnValue({
    provider: 'Test Provider',
    inputCostPer1M: 1,
    outputCostPer1M: 2,
  })
})

describe('CostEstimator context window states', () => {
  it('shows zero usage when the context window is unavailable', () => {
    pricing.getContextWindow.mockReturnValue(0)

    render(<CostEstimator inputText="abcd" modelId="test-model" />)

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('distinguishes a near-limit prompt from an over-limit prompt', () => {
    pricing.getContextWindow.mockReturnValue(100)

    const { rerender } = render(<CostEstimator inputText={'a'.repeat(80)} modelId="test-model" />)
    expect(screen.getByText('80%')).toBeInTheDocument()

    rerender(<CostEstimator inputText={'a'.repeat(100)} modelId="test-model" />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
