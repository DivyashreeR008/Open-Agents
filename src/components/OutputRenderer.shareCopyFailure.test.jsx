import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    configurable: true,
  })
  document.execCommand = vi.fn(() => false)
})

afterEach(() => {
  delete document.execCommand
})

describe('OutputRenderer share copy failure', () => {
  it('names the failed share action in the button label', async () => {
    render(<OutputRenderer content="share me" outputType="text" agentName="t" />)

    fireEvent.click(screen.getByRole('button', { name: 'Share' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Share failed' })).toBeInTheDocument()
    )
    expect(screen.getByText('Copy failed. Select the output and press Ctrl+C.')).toBeInTheDocument()
  })
})
