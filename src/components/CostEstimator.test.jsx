import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CostEstimator from './CostEstimator'
import { formatCost } from '../lib/formatting'
import { tokenEstimate } from '../lib/useTokenCounter'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CostEstimator', () => {
  it('renders nothing for a model without published pricing', () => {
    const { container } = render(
      <CostEstimator inputText="hello" modelId="unknown-model" />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('shows zero for an empty prompt with a known model', () => {
    render(<CostEstimator inputText="" modelId="gpt-4o" />)
    act(() => vi.advanceTimersByTime(300))

    expect(screen.getByText('Cost Estimate')).toBeInTheDocument()
    expect(screen.getByText('openai')).toBeInTheDocument()
    expect(screen.getAllByText('$0.00')).toHaveLength(3)
  })

  it('never renders a nonzero fractional-cent total as free', () => {
    const inputText = 'hello'
    const inputTokens = tokenEstimate(inputText)
    const projectedOutputTokens = Math.min(Math.round(inputTokens * 0.5), 4096)
    const expectedInput = (inputTokens / 1_000_000) * 0.15
    const expectedOutput = (projectedOutputTokens / 1_000_000) * 0.6
    const expectedTotal = expectedInput + expectedOutput

    render(<CostEstimator inputText={inputText} modelId="gpt-4o-mini" />)
    act(() => vi.advanceTimersByTime(300))

    expect(screen.queryByText('$0.00')).not.toBeInTheDocument()
    const totalRow = screen.getByText('Estimated Total').parentElement
    expect(totalRow).toHaveTextContent(formatCost(expectedTotal))
  })

  it('reports the model provider and context usage for a known model', () => {
    render(<CostEstimator inputText="hello" modelId="claude-3-5-sonnet-20241022" />)
    act(() => vi.advanceTimersByTime(300))

    expect(screen.getByText('anthropic')).toBeInTheDocument()
    expect(screen.getByText(/Context window/)).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
