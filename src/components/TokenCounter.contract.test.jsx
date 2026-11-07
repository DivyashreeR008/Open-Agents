import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
  useTokenCounter: vi.fn(),
  getContextWindow: vi.fn(),
}))

vi.mock('../lib/useTokenCounter', () => ({ useTokenCounter: mocks.useTokenCounter }))
vi.mock('../lib/modelPricing', () => ({ getContextWindow: mocks.getContextWindow }))

import TokenCounter from './TokenCounter'

describe('TokenCounter component contract', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useTokenCounter.mockReturnValue({ tokens: 1, isEstimating: false })
    mocks.getContextWindow.mockReturnValue(1000)
  })

  it('passes the prompt and model id to the underlying helpers', () => {
    render(<TokenCounter value="draft prompt" modelId="gpt-4o" />)

    expect(mocks.useTokenCounter).toHaveBeenCalledWith('draft prompt')
    expect(mocks.getContextWindow).toHaveBeenCalledWith('gpt-4o')
  })
})
