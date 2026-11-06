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
  mocks.getContextWindow.mockReturnValue(100)
})

function renderAt(tokens, isEstimating = false) {
  mocks.useTokenCounter.mockReturnValue({ tokens, isEstimating })
  return render(<TokenCounter value="prompt" modelId="model" />)
}

describe('TokenCounter threshold states', () => {
  it('uses the muted state below seventy percent', () => {
    const { container } = renderAt(50)
    expect(container.firstChild.className).toContain('text-gray-400')
  })

  it('uses the warning state between seventy and ninety-five percent', () => {
    const { container } = renderAt(80)
    expect(container.firstChild.className).toContain('text-zinc-600')
    expect(container.firstChild.className).not.toContain('text-zinc-900')
  })

  it('uses the strongest state above ninety-five percent', () => {
    const { container } = renderAt(96)
    expect(container.firstChild.className).toContain('text-zinc-900')
  })

  it('adds a spinner while estimating without replacing the count', () => {
    const { container } = renderAt(42, true)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.getByText(/~42 tokens/)).toBeInTheDocument()
  })
})
