import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
  useTokenCounter: vi.fn(),
  getContextWindow: vi.fn(),
}))

vi.mock('../lib/useTokenCounter', () => ({ useTokenCounter: mocks.useTokenCounter }))
vi.mock('../lib/modelPricing', () => ({ getContextWindow: mocks.getContextWindow }))

import TokenCounter from './TokenCounter'

beforeEach(() => {
  vi.clearAllMocks()
})

function renderCounter(props = {}) {
  return render(<TokenCounter {...props} />)
}

describe('TokenCounter empty and unknown models', () => {
  it('renders zero tokens and hides the limit for an empty prompt', () => {
    mocks.useTokenCounter.mockReturnValue({ tokens: 0, isEstimating: false })
    mocks.getContextWindow.mockReturnValue(0)

    renderCounter()

    expect(screen.getByText(/~0 tokens/)).toBeInTheDocument()
    expect(screen.queryByText(/\/ /)).not.toBeInTheDocument()
  })

  it('hides the limit when the model has no known context window', () => {
    mocks.useTokenCounter.mockReturnValue({ tokens: 900, isEstimating: false })
    mocks.getContextWindow.mockReturnValue(0)

    renderCounter({ value: 'hello', modelId: 'custom-model' })

    expect(screen.getByText(/~900 tokens/)).toBeInTheDocument()
    expect(screen.queryByText(/\/ /)).not.toBeInTheDocument()
  })

  it('does not render the estimating spinner for a settled estimate', () => {
    mocks.useTokenCounter.mockReturnValue({ tokens: 12, isEstimating: false })
    mocks.getContextWindow.mockReturnValue(0)

    const { container } = renderCounter({ value: 'hello' })

    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument()
  })
})
