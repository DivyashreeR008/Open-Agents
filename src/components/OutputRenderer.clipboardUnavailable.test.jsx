import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import OutputRenderer from './OutputRenderer'

describe('OutputRenderer copy without the clipboard API', () => {
  let clipboardDescriptor
  let execCommandDescriptor

  beforeEach(() => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
    execCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand')
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    })
    document.execCommand = vi.fn(() => true)
  })

  afterEach(() => {
    if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor)
    else delete navigator.clipboard
    if (execCommandDescriptor) Object.defineProperty(document, 'execCommand', execCommandDescriptor)
    else delete document.execCommand
    vi.restoreAllMocks()
  })

  it('uses the textarea fallback and reports a successful copy', async () => {
    render(<OutputRenderer content="copy me" outputType="text" agentName="t" />)

    fireEvent.click(screen.getByRole('button', { name: /Copy output/i }))

    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument())
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea[readonly]')).toBeNull()
  })
})
