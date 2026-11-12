import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    configurable: true,
  })
  document.execCommand = vi.fn(() => {
    const textarea = document.querySelector('textarea[readonly]')
    if (textarea) document.body.removeChild(textarea)
    return true
  })
})

afterEach(() => {
  delete document.execCommand
})

describe('OutputRenderer fallback textarea lifecycle', () => {
  it('skips removal when the copy command already detached the textarea', async () => {
    render(<OutputRenderer content="copy me" outputType="text" agentName="t" />)

    fireEvent.click(screen.getByRole('button', { name: /Copy output/i }))

    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument())
    expect(document.querySelector('textarea[readonly]')).toBeNull()
  })
})
