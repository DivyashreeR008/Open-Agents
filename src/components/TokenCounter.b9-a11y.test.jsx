import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

const mocks = vi.hoisted(() => ({ useTokenCounter: vi.fn(), getContextWindow: vi.fn() }))

vi.mock('../lib/useTokenCounter', () => ({ useTokenCounter: mocks.useTokenCounter }))
vi.mock('../lib/modelPricing', () => ({ getContextWindow: mocks.getContextWindow }))

import TokenCounter from './TokenCounter'

describe('TokenCounter accessible status', () => {
  it('names the estimate, marks the spinner as decorative, and exposes a busy state', () => {
    mocks.useTokenCounter.mockReturnValue({ tokens: 1234, isEstimating: true })
    mocks.getContextWindow.mockReturnValue(8000)

    render(<TokenCounter value="hello" modelId="gpt-4.1" />)

    const status = screen.getByRole('status', {
      name: 'Estimated 1,234 tokens of 8,000, updating',
    })
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(status.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(within(status).getByText('Updating token estimate')).toHaveClass('sr-only')
  })

  it('removes the busy state once estimation settles', () => {
    mocks.useTokenCounter.mockReturnValue({ tokens: 12, isEstimating: false })
    mocks.getContextWindow.mockReturnValue(0)

    render(<TokenCounter value="hello" />)

    expect(screen.getByRole('status', { name: 'Estimated 12 tokens' })).toHaveAttribute(
      'aria-busy',
      'false'
    )
    expect(screen.queryByText('Updating token estimate')).not.toBeInTheDocument()
  })
})
