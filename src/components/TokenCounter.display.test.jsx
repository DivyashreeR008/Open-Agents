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

describe('TokenCounter display', () => {
  it('renders the estimate and context window with locale formatting', () => {
    mocks.useTokenCounter.mockReturnValue({ tokens: 12345, isEstimating: false })
    mocks.getContextWindow.mockReturnValue(128000)

    render(<TokenCounter value="a prompt" modelId="gpt-4.1" />)

    expect(screen.getByText(/~12,345 tokens/)).toBeInTheDocument()
    expect(screen.getByText(/\/ 128,000/)).toBeInTheDocument()
  })

  it('shows zero as a readable count instead of an empty value', () => {
    mocks.useTokenCounter.mockReturnValue({ tokens: 0, isEstimating: false })
    mocks.getContextWindow.mockReturnValue(128000)

    render(<TokenCounter />)

    expect(screen.getByText(/~0 tokens/)).toBeInTheDocument()
    expect(screen.getByText(/\/ 128,000/)).toBeInTheDocument()
  })
})
